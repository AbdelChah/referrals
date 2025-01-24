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
        const { application, referee, referralId, action, transaction, debitOrCredit, amount, currency } = req.body;
        console.log('Received refereeAction request:', req.body);

        // Validate input
        if (!application || !referee || !referralId || !action) {
            return res.status(400).json({
                res: false,
                responseError: {
                    msg: 'Application, referee, referralId, and action are required.',
                    errCode: '19181',
                    msgAPI: 'Missing required fields.',
                },
            });
        }

        // Fetch referral document with session
        const referral = await Referral.findOne(
            { referral_code: referralId },
            null,
            { session }
        ).exec();

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

        // Fetch associated campaign (not part of the session on purpose, but it’s okay to do so as needed)
        const campaign = await Campaign.findById(referral.campaign_id).exec();
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

        // Find or initialize referee
        let refereeIndex = referral.referees.findIndex(r => r.referee_phone === referee);
        if (refereeIndex === -1) {
            refereeIndex = referral.referees.length;
            referral.referees.push({
                referee_phone: referee,
                status: false, // Default status
                actions: [],
                rewards: {
                    onBoarding: false,
                    transaction: false,
                    transactionsCount: 0, // Track how many valid transactions this referee has made
                },
            });
        }

        const refereeData = referral.referees[refereeIndex];

        // =============== HANDLE ONBOARDING ACTION ===============
        if (action === 'onBoarding') {
            if (refereeData.rewards.onBoarding) {
                await session.abortTransaction();
                return res.status(409).json({
                    res: false,
                    responseError: {
                        msg: 'Onboarding already registered.',
                        errCode: '19192',
                        msgAPI: 'Duplicate onboarding reward claim.',
                    },
                });
            }

            refereeData.actions.push({ type: action, date: new Date() });
            refereeData.rewards.onBoarding = true;

            await referral.save({ session });
            await session.commitTransaction();

            return res.status(200).json({
                res: true,
                response: {
                    msg: 'Onboarding action logged successfully.',
                },
            });
        }

        // =============== HANDLE TRANSACTION ACTION ===============
        if (action === 'transaction') {
            const criteria = campaign.reward_criteria.transaction;

            // If the campaign does not have transaction criteria, abort
            if (!criteria) {
                // Possibly the campaign only has onBoarding criteria
                refereeData.actions.push({
                    type: action,
                    details: { transaction, amount, currency },
                    date: new Date(),
                });
                await referral.save({ session });
                await session.commitTransaction();

                return res.status(200).json({
                    res: true,
                    response: {
                        msg: 'Transaction logged, but this campaign has no transaction reward criteria.',
                    },
                });
            }

            const { minAmount, reward, currency: campaignCurrency, transaction_type, debitOrCredit: campaignDebitOrCredit, count } = criteria;

            // ========== DYNAMIC VALIDATION ==========
            // We only check a field if it exists in the criteria.
            // For example, if 'transaction_type' is undefined in the campaign,
            // we do NOT fail the validation for that reason.

            let isValid = true;
            // 1. Minimum amount
            if (typeof minAmount === 'number' && amount < minAmount) {
                isValid = false;
            }
            // 2. Currency
            if (campaignCurrency && campaignCurrency !== currency) {
                isValid = false;
            }
            // 3. Transaction type (e.g. 'CASH_OUT', 'TRANSFER', etc.)
            if (transaction_type && transaction_type !== transaction) {
                isValid = false;
            }
            // 4. Debit/Credit
            if (campaignDebitOrCredit && campaignDebitOrCredit !== debitOrCredit) {
                isValid = false;
            }

            // Log the transaction attempt
            refereeData.actions.push({
                type: action,
                details: { transaction, amount, currency },
                date: new Date(),
            });

            if (!isValid) {
                // This transaction does not meet reward criteria
                refereeData.status = false;
                await referral.save({ session });
                await session.commitTransaction();

                return res.status(200).json({
                    res: true,
                    response: {
                        msg: 'Transaction action logged. No reward dispatched.',
                    },
                });
            }

            // ========== VALID TRANSACTION ==========

            // Increment the number of valid transactions for this referee
            if (typeof refereeData.rewards.transactionsCount !== 'number') {
                refereeData.rewards.transactionsCount = 0;
            }
            refereeData.rewards.transactionsCount += 1;

            // Check if the referee now meets the required count
            if (refereeData.rewards.transactionsCount >= count) {
                // Mark the referee's transaction as rewarded
                refereeData.status = true;
                refereeData.rewards.transaction = true;
            } else {
                // Still hasn't reached required count, so mark status as false
                refereeData.status = false;
                refereeData.rewards.transaction = false;
            }

            // Recount how many referees have 'status = true'
            const validRefereesCount = referral.referees.filter(r => r.status).length;
            referral.total_rewards = validRefereesCount;

            // Only dispatch reward if:
            //    (1) The referee indeed meets transaction count (status = true),
            //    (2) The total referees who meet criteria = min_referees
            if (refereeData.status && validRefereesCount === campaign.min_referees) {
                try {
                    await axios.post(`${process.env.JUNO_URL}/juno/callbacks/referrals/reward`, {
                        application,
                        referrer: referral.referrer_phone,
                        amount: reward,      // from campaign criteria
                        currency,
                        referralId,
                    });
                    console.log('Reward dispatched to referrer.');
                } catch (dispatchError) {
                    console.error('Error dispatching reward:', dispatchError);
                    // NOTE: If you do not want to rollback the transaction
                    // because the external call failed, you can just log
                    // and continue. Otherwise, you can `throw` to abort.
                    // For now, let's just log it and proceed.
                }
            }

            await referral.save({ session });
            await session.commitTransaction();

            return res.status(200).json({
                res: true,
                response: {
                    msg: 'Transaction processed. Reward dispatched if eligible.',
                },
            });
        }

        // =============== INVALID ACTION ===============
        await session.abortTransaction();
        return res.status(400).json({
            res: false,
            responseError: {
                msg: 'Invalid action type.',
                errCode: '19195',
                msgAPI: 'Action type is not supported.',
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

        // Fetch multivalues to validate the application
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

        // Fetch referral document
        const referral = await Referral.findOne({ referral_code: referralId, referrer_phone: referrer });

        if (!referral) {
            return res.status(404).json({
                res: false,
                responseError: {
                    msg: 'Cannot get status for referral code...',
                    errCode: '19182',
                    msgAPI: 'Invalid referral code or referrer.',
                },
            });
        }

        // Compute referees status
        const refereesStatus = referral.referees.map(referee => {
            const onboardingReward = referee.rewards?.onBoarding || false;
            const transactionReward = referee.rewards?.transaction || false;

            let status = null;
            if (onboardingReward && transactionReward) {
                status = true;
            } else if (onboardingReward) {
                status = false;
            } else if (transactionReward) {
                status = true;
            }

            return { [referee.referee_phone]: status };
        });

        // Return response
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
        // Fetch all referral documents
        const referrals = await Referral.find({}).populate('campaign_id');

        // Process each referral document
        const result = referrals.map(referral => {
            return {
                referrer_phone: referral.referrer_phone,
                campaigns: [
                    {
                        campaignId: referral.campaign_id._id,
                        campaignName: referral.campaign_id.name,
                        description: referral.campaign_id.description,
                        referees: referral.referees.map(referee => ({
                            referralId: referral.referral_id,
                            referee_phone: referee.referee_phone,
                            date: referee.actions.length > 0 ? referee.actions[0].date : null, // Get the date of the first action
                            status: referral.total_rewards >= referral.campaign_id.min_referees,
                        })),
                    },
                ],
            };
        });

        // Return the response
        res.status(200).json({ referrals: result });
    } catch (error) {
        console.error('Error fetching referrals:', error);
        res.status(500).json({
            res: false,
            responseError: {
                msg: 'Failed to fetch referrals.',
                errCode: '19200',
                msgAPI: 'System error while fetching referrals.',
            },
        });
    }
};
