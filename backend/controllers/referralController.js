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
      const { application, referrer, campaignName } = req.body;

      // Validate input
      if (!application || !referrer || !campaignName) {
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
      const activeCampaign = await Campaign.findOne({ name: campaignName, status: 'active' });
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
      const referralCode = generateReferralCode(referrer, campaignName);

      // Save the referral with an empty referees array
      const newReferral = new Referral({
          campaign_id: activeCampaign._id,
          referrer_phone: referrer,
          referral_code: referralCode,
          application,
          referees: [], // Initialize with an empty array
      });

      await newReferral.save();

      return res.status(201).json({
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
        console.log('Received refereeAction request:', { application, referee, referralId, action });

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

        // Fetch multivalues for validation
        const multivalues = await fetchMultivalues();
        const validApplications = multivalues.response.application.values.map(item => item.id);
        const validActions = multivalues.response.action.values.map(item => item.id);

        // Validate application and action
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

        if (!validActions.includes(action)) {
            return res.status(400).json({
                res: false,
                responseError: {
                    msg: 'Invalid action.',
                    errCode: '19187',
                    msgAPI: `Supported actions: ${validActions.join(', ')}.`,
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

        // Fetch associated campaign
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

        // Find referee index
        let refereeIndex = referral.referees.findIndex(r => r.referee_phone === referee);
        
        // Initialize new referee if not found
        if (refereeIndex === -1) {
            refereeIndex = referral.referees.length;
            referral.referees.push({
                referee_phone: referee,
                actions: [],
                rewards: { onBoarding: false, transaction: false }
            });
        }

        // Helper function to trigger reward API
        const triggerReward = async (rewardAmount, rewardCurrency) => {
            const payload = {
                application,
                referrer: referral.referrer_phone,
                amount: rewardAmount,
                currency: rewardCurrency,
                referralId,
            };

            console.log('Triggering reward:', payload);
            
            const response = await axios.post(
                `${process.env.JUNO_URL}/juno/callbacks/referrals/reward`,
                payload
            );
            
            console.log('Reward API Response:', response.data);
            return response;
        };

        // Handle onboarding action
        if (action === 'onBoarding') {
            if (referral.referees[refereeIndex].rewards.onBoarding) {
                await session.abortTransaction();
                return res.status(409).json({
                    res: false,
                    responseError: {
                        msg: 'The onboarding reward has already been claimed for this referee.',
                        errCode: '19192',
                        msgAPI: 'Duplicate onboarding reward claim.',
                    },
                });
            }

            try {
                const rewardCurrency = campaign.reward_criteria.currency || 'USD';
                await triggerReward(campaign.reward_criteria.onBoarding.reward, rewardCurrency);

                referral.referees[refereeIndex].rewards.onBoarding = true;
                referral.referees[refereeIndex].actions.push({
                    type: action,
                    date: new Date(),
                    status: 'rewarded'
                });

                await referral.save({ session });
                await session.commitTransaction();

                return res.status(200).json({
                    res: true,
                    response: {
                        msg: 'Onboarding reward dispatched successfully.',
                    },
                });
            } catch (error) {
                await session.abortTransaction();
                console.error('Onboarding reward error:', error);
                
                return res.status(500).json({
                    res: false,
                    responseError: {
                        msg: 'Failed to dispatch onboarding reward.',
                        errCode: '19193',
                        msgAPI: 'Onboarding reward dispatch failed.',
                    },
                });
            }
        }

        // Handle transaction action
        if (action === 'transaction') {
            const criteria = campaign.reward_criteria.transaction;

            // Validate transaction fields
            const validTransactions = multivalues.response.transaction.values.map(item => item.id);
            const validDebitOrCredit = multivalues.response.debitOrCredit.values.map(item => item.id);
            const validCurrencies = multivalues.response.currency.values.map(item => item.id);

            if (!validTransactions.includes(transaction)) {
                await session.abortTransaction();
                return res.status(400).json({
                    res: false,
                    responseError: {
                        msg: 'Invalid transaction type.',
                        errCode: '19188',
                        msgAPI: `Supported transaction types: ${validTransactions.join(', ')}.`,
                    },
                });
            }

            if (!validDebitOrCredit.includes(debitOrCredit)) {
                await session.abortTransaction();
                return res.status(400).json({
                    res: false,
                    responseError: {
                        msg: 'Invalid debitOrCredit type.',
                        errCode: '19189',
                        msgAPI: `Supported debitOrCredit values: ${validDebitOrCredit.join(', ')}.`,
                    },
                });
            }

            if (!validCurrencies.includes(currency)) {
                await session.abortTransaction();
                return res.status(400).json({
                    res: false,
                    responseError: {
                        msg: 'Invalid currency.',
                        errCode: '19190',
                        msgAPI: `Supported currencies: ${validCurrencies.join(', ')}.`,
                    },
                });
            }

            const newAction = {
                type: action,
                details: { transaction, debitOrCredit, amount, currency },
                date: new Date(),
                status: 'pending'
            };

            // Check if already rewarded
            if (referral.referees[refereeIndex].rewards.transaction) {
                newAction.status = 'rewarded';
                referral.referees[refereeIndex].actions.push(newAction);
                await referral.save({ session });
                await session.commitTransaction();

                return res.status(200).json({
                    res: true,
                    response: {
                        msg: 'Action recorded. The transaction reward has already been claimed.',
                    },
                });
            }

            // Check reward eligibility
            const isEligibleForReward =
                amount >= criteria.minAmount &&
                criteria.currency === currency &&
                criteria.transaction_type === transaction &&
                criteria.debitOrCredit === debitOrCredit;

            if (isEligibleForReward) {
                try {
                    await triggerReward(criteria.reward, currency);
                    
                    newAction.status = 'rewarded';
                    referral.referees[refereeIndex].rewards.transaction = true;
                    referral.referees[refereeIndex].actions.push(newAction);
                    
                    await referral.save({ session });
                    await session.commitTransaction();

                    return res.status(201).json({
                        res: true,
                        response: {
                            msg: 'Transaction reward dispatched successfully.',
                        },
                    });
                } catch (error) {
                    await session.abortTransaction();
                    console.error('Transaction reward error:', error);
                    
                    return res.status(500).json({
                        res: false,
                        responseError: {
                            msg: 'Failed to dispatch transaction reward.',
                            errCode: '19194',
                            msgAPI: 'Transaction reward dispatch failed.',
                        },
                    });
                }
            }

            // Record non-eligible transaction
            referral.referees[refereeIndex].actions.push(newAction);
            await referral.save({ session });
            await session.commitTransaction();

            return res.status(200).json({
                res: true,
                response: {
                    msg: 'Action recorded. The transaction does not meet the reward criteria.',
                },
            });
        }

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
                status = 'OnBoarding_Transaction_true';
            } else if (onboardingReward) {
                status = 'OnBoarding_true';
            } else if (transactionReward) {
                status = 'Transaction_true';
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


