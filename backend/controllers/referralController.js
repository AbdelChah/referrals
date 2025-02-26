const axios = require('axios');
const Referral = require('../models/Referrals');
const Campaign = require('../models/Campaign');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Fetch multivalues dynamically
const fetchMultivalues = async () => {
    try {
        const response = await axios.post(
            `${process.env.JUNO_URL}/juno/callbacks/referrals/multivalues`,
            { application: 'bobfinance' }, // Body
            {
                headers: {
                    'Content-Type': 'application/json',
                    'preferred_locale': 'en',
                    'channel': 'REFERRALS',
                    'deviceId': 'JunoREF1234567890',
                    'reqSpec': 'false',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching multivalues:', error.message);
        throw new Error('Failed to fetch multivalues');
    }
};

// Helper: Check if a referee meets ALL relevant criteria from the campaign
function checkRefereeEligibility(campaign, refereeData) {
    const { onBoarding, transaction_flow, transaction } = campaign.reward_criteria;
  
    // 1) onBoarding check
    if (onBoarding === true && !refereeData.rewards.onBoarding) {
      return false;
    }
  
    // 2) transaction_flow check
    //    If transaction_flow is provided with a debitOrCredit, then we require refereeData.rewards.transaction_flow
    if (transaction_flow && transaction_flow.debitOrCredit) {
      if (!refereeData.rewards.transaction_flow) {
        return false;
      }
    }
  
    // 3) transaction check
    //    If transaction is provided with a non-empty array of transaction_type, we require transaction_type = true
    if (
      transaction &&
      Array.isArray(transaction.transaction_type) &&
      transaction.transaction_type.length > 0
    ) {
      // The campaign actually requires typed transactions
      if (!refereeData.rewards.transaction_type) {
        return false;
      }
    }
    // else if transaction.transaction_type.length === 0, we treat it as "no transaction requirement"
  
    // If we pass all checks, they're fully eligible
    return true;
  }

// Generate a unique referral code
const generateReferralCode = (referrer, campaignName) => {
  const hash = crypto.createHash('sha256');
  hash.update(referrer + campaignName); // Combine referrer and campaignName
  return hash.digest('hex').slice(0, 8).toUpperCase(); // Take first 8 characters and uppercase
};

// Generate referral code
exports.generateReferralCode = async (req, res) => {
  try {
      const { application, referrer } = req.body;

      // Validate input
      if (!application || !referrer ) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'Application, referrer, and campaign name are required.',
                  errCode: '19181',
                  msgAPI: 'Missing required fields.',
              },
          });
      }

      // Fetch multivalues
      const multivalues = await fetchMultivalues(); // Assuming fetchMultivalues is defined
      const validApplications = multivalues.response.application.values.map(item => item.id);

      // Validate application
      if (!validApplications.includes(application)) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'Invalid application.',
                  errCode: '19186',
                  msgAPI: `Supported applications: ${validApplications.join(', ')}.`,
              },
          });
      }

      // Check for active campaign
      const activeCampaign = await Campaign.findOne();
      if (!activeCampaign) {
          return res.status(404).json({
              res: false,
              responseError: {
                  msg: 'No active campaign found.',
                  errCode: '19182',
                  msgAPI: 'Campaign not found or inactive.',
              },
          });
      }

      // Check if a referral already exists for this referrer and campaign
      const existingReferral = await Referral.findOne({
          referrer_phone: referrer,
          campaign_id: activeCampaign._id,
      });
      if (existingReferral) {
          return res.status(409).json({
              res: false,
              responseError: {
                  msg: 'Referral code already exists for this campaign and referrer.',
                  errCode: '19187',
                  msgAPI: 'Duplicate referral code for the same campaign and referrer.',
              },
          });
      }

      // Generate a unique referral code
      const referralCode = generateReferralCode(referrer, activeCampaign.name);

      // Save the referral with an empty referees array
      const newReferral = new Referral({
          campaign_id: activeCampaign._id,
          referrer_phone: referrer,
          referral_code: referralCode,
          application,
          referees: [], // Initialize with an empty array
      });

      await newReferral.save();

      return res.status(200).json({
          res: true,
          response: {
              referralId: referralCode,
          },
      });
  } catch (error) {
      console.error('Error generating referral code:', error.message);
      return res.status(500).json({
          res: false,
          responseError: {
              msg: 'System Error.',
              errCode: '19183',
              msgAPI: 'Failed to generate referral code.',
          },
      });
  }
};

// Validate referral code
exports.validateReferralCode = async (req, res) => {
    try {
        const { application, referrer, referralId } = req.body;

        // Validate input
        if (!application || !referrer || !referralId) {
            return res.status(400).json({
                res: false,
                responseError: {
                    msg: 'Application, referrer, and referralId are required.',
                    errCode: '19181',
                    msgAPI: 'Missing required fields.',
                },
            });
        }

        // Fetch and validate multivalues
        const multivalues = await fetchMultivalues();
        const validApplications = multivalues.response.application.values.map(item => item.id);

        if (!validApplications.includes(application)) {
            return res.status(400).json({
                res: false,
                responseError: {
                    msg: 'Invalid application.',
                    errCode: '19186',
                    msgAPI: `Supported applications: ${validApplications.join(', ')}.`,
                },
            });
        }

        // Check if the referralId exists
        const referral = await Referral.findOne({ referral_code: referralId });
        if (!referral) {
            return res.status(404).json({
                res: false,
                responseError: {
                    msg: 'Referral code does not exist.',
                    errCode: '19182',
                    msgAPI: 'Invalid referral code.',
                },
            });
        }

        // Check if the referrer matches
        if (referral.referrer_phone !== referrer) {
            return res.status(403).json({
                res: false,
                responseError: {
                    msg: 'Referrer does not match referralId.',
                    errCode: '19184',
                    msgAPI: `The referralId ${referralId} is not associated with referrer ${referrer}.`,
                },
            });
        }

        // Referral code is active
        return res.status(200).json({
            res: true,
            response: {
                msg: 'Referral code is active',
                isReferralIdValid : true
            },
        });
    } catch (error) {
        console.error('Error validating referral code:', error.message);
        return res.status(500).json({
            res: false,
            responseError: {
                msg: 'System Error.',
                errCode: '19183',
                msgAPI: 'Failed to validate referral code.',
            },
        });
    }
};

//Import Actions 
exports.refereeAction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const {
        application,
        referee,
        referralId,
        action,
        transaction,    // e.g. 'P2P', 'CASH_IN'
        debitOrCredit,  // 'debit' or 'credit'
        amount,         // numeric
        currency,       // e.g. 'USD', 'LBP'
      } = req.body;
  
      console.log('Received refereeAction request:', req.body);
  
      // 1) Basic validation
      if (!application || !referee || !referralId || !action) {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'application, referee, referralId, and action are required.',
            errCode: '19181',
            msgAPI: 'Missing required fields.',
          },
        });
      }
  
      // 2) Fetch the referral
      const referral = await Referral.findOne(
        { referral_code: referralId },
        null,
        { session }
      );
      if (!referral) {
        await session.abortTransaction();
        return res.status(404).json({
          res: false,
          responseError: {
            msg: 'Referral code does not exist.',
            errCode: '19182',
            msgAPI: 'Invalid referral code.',
          },
        });
      }
  
      // 3) Fetch the associated campaign
      const campaign = await Campaign.findOne({ _id: referral.campaign_id }).exec();

  
      if (!campaign) {
        await session.abortTransaction();
        return res.status(404).json({
          res: false,
          responseError: {
            msg: 'Associated campaign does not exist.',
            errCode: '19183',
            msgAPI: 'Invalid campaign.',
          },
        });
      }
  
      // 4) Find or create the referee in this referral
      let refereeIndex = referral.referees.findIndex(
        (r) => r.referee_phone === referee
      );
      if (refereeIndex === -1) {
        refereeIndex = referral.referees.length;
        referral.referees.push({
          referee_phone: referee,
          status: false,
          actions: [],
          rewards: {
            onBoarding: false,
            transaction_flow: false,
            transaction_count: 0,
            transaction_type: false,
          },
        });
      }
      const refereeData = referral.referees[refereeIndex];
  
      // Always log the incoming action for audit
      refereeData.actions.push({
        type: action,
        details: { transaction, amount, currency, debitOrCredit },
        date: new Date(),
      });
  
      // 5) If the action is ONBOARDING
      if (action === 'onBoarding') {
        if (campaign.reward_criteria.onBoarding) {
          // If they've already done onBoarding, you can either ignore or handle conflict
          if (!refereeData.rewards.onBoarding) {
            // Mark onBoarding as complete
            refereeData.rewards.onBoarding = true;
          }
        }
        // If the campaign doesn't require onBoarding, we just log it
      }
  
      // 6) If the action is TRANSACTION
      if (action === 'transaction') {
        const { transaction_flow, transaction: transactionCriteria } =
          campaign.reward_criteria || {};
  
        // 6A) transaction_flow
        if (transaction_flow && transaction_flow.debitOrCredit) {
          const requiredDebitOrCredit = transaction_flow.debitOrCredit;
          const requiredMinAmount = transaction_flow.min_amount || 0;
  
          const matchesDebitOrCredit =
            !requiredDebitOrCredit || debitOrCredit === requiredDebitOrCredit;
          const meetsMinAmount =
            typeof requiredMinAmount === 'number' ? amount >= requiredMinAmount : true;
  
          if (matchesDebitOrCredit && meetsMinAmount) {
            refereeData.rewards.transaction_flow = true;
          }
        }
  
        // 6B) transaction (typed transactions + min_count)
        if (
          transactionCriteria &&
          Array.isArray(transactionCriteria.transaction_type)
        ) {
          // If transaction_type is empty, it means there's no actual transaction requirement
          if (transactionCriteria.transaction_type.length > 0) {
            // We do have transaction type criteria to check
            const validTypes = transactionCriteria.transaction_type; // e.g. ['P2P','CASH_IN']
            const minCount = transactionCriteria.min_count || 1;
  
            // If this transaction is in the valid list, increment the user's count
            if (validTypes.includes(transaction)) {
              refereeData.rewards.transaction_count += 1;
            }
  
            // Check if we meet or exceed the required count
            if (refereeData.rewards.transaction_count >= minCount) {
              refereeData.rewards.transaction_type = true;
            }
          } else {
            // transaction_type is empty => no typed transaction requirement
            // => we skip setting transaction_type to true
            // or you could automatically set it to true, depending on your logic.
          }
        }
      }
  
      // 7) Re-check overall status
      const wasQualifiedBefore = refereeData.status;
      refereeData.status = checkRefereeEligibility(campaign, refereeData);
  
      // 8) Count how many referees have status = true
      const validRefereesCount = referral.referees.filter((r) => r.status).length;
      referral.total_rewards = validRefereesCount;
  
      // 9) Dispatch reward if:
      //    - This referee just qualified (false -> true)
      //    - validRefereesCount >= campaign.min_referees
      if (!wasQualifiedBefore && refereeData.status) {
        if (validRefereesCount === campaign.min_referees) {
          const rewardAmount = campaign.reward_criteria.reward_amount;
          const rewardCurrency = campaign.reward_criteria.currency;
  
          try {
            await axios.post(`${process.env.JUNO_URL}/juno/callbacks/referrals/reward`, {
              application,
              referrer: referral.referrer_phone,
              amount: rewardAmount,
              currency: rewardCurrency,
              referralId,
            });
            referral.reward_claimed = true;
            console.log(
              `Reward dispatched to ${referral.referrer_phone}: ${rewardAmount} ${rewardCurrency}.`
            );

            
          } catch (err) {
            console.error('Error dispatching reward:', err.message);
            // Decide if you want to rollback or just log the failure
          }
        }
      }
  
      // 10) Save & finalize
      await referral.save({ session });
      await session.commitTransaction();
  
      return res.status(200).json({
        res: true,
        response: {
          msg: 'Referee action processed successfully.',
          currentQualifiedReferees: validRefereesCount,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error processing referee action:', error);
      return res.status(500).json({
        res: false,
        responseError: {
          msg: 'System Error.',
          errCode: '19196',
          msgAPI: 'Failed to process referee action.',
        },
      });
    } finally {
      session.endSession();
    }
  };

  exports.getRefereesStatus = async (req, res) => {
    try {
      const { application, referrer, referralId } = req.body;
  
      // 1) Basic validation
      if (!application || !referrer || !referralId) {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'Application, referrer, and referralId are required.',
            errCode: '19181',
            msgAPI: 'Missing required fields.',
          },
        });
      }
  
      // 2) Fetch valid applications from multivalues
      const multivalues = await fetchMultivalues();
      const validApplications =
        multivalues?.response?.application?.values?.map((item) => item.id) || [];
  
      if (!validApplications.includes(application)) {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'Invalid application.',
            errCode: '19186',
            msgAPI: `Supported applications: ${validApplications.join(', ')}.`,
          },
        });
      }
  
      // 3) Fetch the referral document
      const referral = await Referral.findOne({
        referral_code: referralId,
        referrer_phone: referrer,
      });
  
      if (!referral) {
        return res.status(404).json({
          res: false,
          responseError: {
            msg: 'Cannot get status for referral code or referrer.',
            errCode: '19182',
            msgAPI: 'Invalid referral code or referrer.',
          },
        });
      }
  
      // 4) Format the refereesStatus array
      //    Must be in the form: [{ "+32123": true/false }, { "+98765": true/false }, ...]
      const refereesStatus = referral.referees.map((referee) => {
        return { [referee.referee_phone]: referee.status };
      });
  
      // 5) Return the required response shape
      return res.status(200).json({
        res: true,
        response: {
          refereesStatus,
        },
      });
    } catch (error) {
      console.error('Error fetching referees status:', error.message);
      return res.status(500).json({
        res: false,
        responseError: {
          msg: 'System Error...',
          errCode: '19184',
          msgAPI: 'Cannot retrieve referee statuses.',
        },
      });
    }
  };

  exports.getReferrals = async (req, res) => {
    try {
      // 1) Fetch all referrals, populating the 'campaign_id' reference
      const referrals = await Referral.find({}).populate('campaign_id');
  
      // 2) Process each referral
      const result = referrals.map((referral) => {
        // Basic campaign details
        const campaignDoc = referral.campaign_id || {};
        const {
          _id: campaignDbId,
          campaign_id: campaignUuid,  // The 'campaign_id' field from Campaign schema
          name: campaignName,
          start_date,
          end_date,
          min_referees,
          reward_criteria,
          status: campaignStatus,
        } = campaignDoc;
  
        // Map referees
        const refereesInfo = referral.referees.map((ref) => ({
          referralId: referral.referral_code,
          referee_phone: ref.referee_phone,
          // Date of the first action, if any
          date: ref.actions?.[0]?.date || null,
          // Each referee in your schema has its own .status
          qualified: ref.status,
        }));
  
        // If you want an overall "campaignComplete" flag (whether the campaign's threshold is met or passed):
        const campaignComplete = referral.total_rewards >= (min_referees || 0);
  
        return {
          referrer_phone: referral.referrer_phone,
          campaigns: [
            {
              campaignDbId,       // MongoDB _id
              campaignId: campaignUuid, // The custom 'campaign_id' from the schema
              campaignName,
              start_date,
              end_date,
              min_referees,
              status: campaignStatus,
              reward_criteria,
              referees: refereesInfo,
              totalQualifiedReferees: referral.total_rewards,
              campaignComplete, // True if total_rewards >= min_referees
            },
          ],
        };
      });
  
      // 3) Send the response
      return res.status(200).json({ referrals: result });
    } catch (error) {
      console.error('Error fetching referrals:', error);
      return res.status(500).json({
        res: false,
        responseError: {
          msg: 'Failed to fetch referrals.',
          errCode: '19200',
          msgAPI: 'System error while fetching referrals.',
        },
      });
    }
  };
  

  exports.getReferralReport = async (req, res) => {
    try {
      // Fetch all referrals and populate the related campaigns
      const referrals = await Referral.find({}).populate('campaign_id').lean();
  
      let totalReferrers = 0;
      let totalReferees = 0;
      let totalRewardClaimed = 0;
      let totalQualifiedReferees = 0;
  
      const campaignReports = referrals.reduce((campaignMap, referral) => {
        const campaign = referral.campaign_id;
  
        // Handle missing campaign data
        if (!campaign) {
          console.warn(`Referral with ID ${referral.referral_code} has no associated campaign.`);
          return campaignMap; // Skip this referral
        }
  
        // Initialize campaign in the map if it doesn't exist
        if (!campaignMap[campaign.campaign_id]) {
          campaignMap[campaign.campaign_id] = {
            campaign_id: campaign.campaign_id,
            name: campaign.name,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            min_referees: campaign.min_referees, // Include min_referees
            reward_criteria: campaign.reward_criteria,
            referrers: [],
          };
        }
  
        // Add referrer details
        totalReferrers += 1; // Increment total referrers
        if (referral.reward_claimed) totalRewardClaimed += 1; // Increment claimed rewards
  
        const referrerDetails = {
          referrer_phone: referral.referrer_phone,
          isClaimed: referral.reward_claimed, // Add isClaimed next to referrer_phone
          referees: referral.referees.map((referee) => {
            totalReferees += 1; // Increment total referees
            if (referee.status) totalQualifiedReferees += 1; // Increment qualified referees
  
            const startDate = referee.actions[0]?.date || null; // First action date
            const completionDate = referee.status
              ? referee.actions.find((action) =>
                  checkRefereeEligibility(campaign, referee)
                )?.date || null
              : null;
  
            return {
              referee_phone: referee.referee_phone,
              status: referee.status,
              start_date: startDate,
              completion_date: completionDate,
            };
          }),
        };
  
        campaignMap[campaign.campaign_id].referrers.push(referrerDetails);
  
        return campaignMap;
      }, {});
  
      // Convert the campaign map to an array
      const campaignsReport = Object.values(campaignReports);
  
      // Send the response
      res.status(200).json({
        res: true,
        response: {
          totalCampaigns: campaignsReport.length,
          totalReferrers,
          totalReferees,
          totalRewardClaimed,
          totalQualifiedReferees,
          campaigns: campaignsReport,
        },
      });
    } catch (error) {
      console.error('Error generating campaign report:', error);
      res.status(500).json({
        res: false,
        responseError: {
          msg: 'Failed to generate campaign report.',
          errCode: '19203',
          msgAPI: 'System error while generating report.',
        },
      });
    }
  };
  

  // Get active campaigns for specific Application
  exports.getActiveCampaigns = async (req, res) => {
  try {
    const currentDate = new Date();
    const activeCampaigns = await Campaign.find(
      {
        start_date: { $lte: currentDate },
        end_date: { $gte: currentDate }
      },
      {
        campaign_id: 1,
        name: 1,
        end_date: 1,
        min_referees: 1,
        reward_criteria: 1
      }
    );

    // Format each campaign to match the required response format
    const formattedCampaigns = activeCampaigns.map(campaign => ({
      id: campaign._id,
      referralCampaignTitle: campaign.name,
      // Generate a description dynamically based on the campaign details.
      // This example uses the campaign name, min_referees, reward_amount, and currency.
      referralCampaignDesc: `Share ${campaign.name} with ${campaign.min_referees} friend${campaign.min_referees > 1 ? 's' : ''} and earn ${campaign.reward_criteria.currency}${campaign.reward_criteria.reward_amount} for yourself`,
      referralCampaignExpires: campaign.end_date
    }));

    res.status(200).json({
      res: true,
      response: formattedCampaigns
    });
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
    res.status(500).json({
      res: false,
      responseError: {
        msg: 'System Error...',
        errCode: '19182',
        msgAPI: 'System Error...'
      }
    });
  }
};

  
  
  
  
  
  