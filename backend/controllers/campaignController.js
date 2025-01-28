/*******************************
 * controllers/campaignController.js
 ******************************/
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Campaign = require('../models/Campaign');
const { Parser } = require('json2csv');
const Referral = require('../models/Referrals');


// Fetch multivalues from remote endpoint
const fetchMultivalues = async () => {
  try {
    const response = await axios.post(
      `${process.env.JUNO_URL}/juno/callbacks/referrals/multivalues`,
      { application: 'bobfinance' }, // Body
      {
        headers: {
          'Content-Type': 'application/json',
          'preferred_locale': 'en',
          channel: 'REFERRALS',
          deviceId: 'JunoREF1234567890',
          reqSpec: 'false',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching multivalues:', error.message);
    throw new Error('Failed to fetch multivalues');
  }
};

/**
 * Helper function to build the eligibility criteria string
 */
function buildEligibilityCriteria(criteria) {
  const parts = [];

  if (criteria.onBoarding) parts.push('Onboarding Required');
  if (criteria.transaction_flow) {
    const { debitOrCredit, min_amount } = criteria.transaction_flow;
    if (debitOrCredit && min_amount) {
      parts.push(`TransactionFlow: ${debitOrCredit} of ${min_amount}`);
    }
  }
  if (criteria.transaction && criteria.transaction.transaction_type) {
    const types = criteria.transaction.transaction_type.join(', ');
    const minCount = criteria.transaction.min_count || 0;
    parts.push(`Transactions: ${types}, Minimum Count: ${minCount}`);
  }

  return parts.join(' | ');
}

// Helper function to compute campaign status dynamically
const computeCampaignStatus = (start_date, end_date) => {
  const currentDate = new Date();
  if (currentDate >= new Date(start_date) && currentDate <= new Date(end_date)) {
    return 'active';
  } else if (currentDate > new Date(end_date)) {
    return 'completed';
  }
  return 'inactive';
};

exports.createCampaign = async (req, res) => {
  try {
    // Fetch valid values from the remote endpoint
    const multivalues = await fetchMultivalues();
    const validCurrencies =
      multivalues?.response?.currency?.values?.map((v) => v.id) || [];
    const validDebitOrCredit =
      multivalues?.response?.debitOrCredit?.values?.map((v) => v.id) || [];
    const validTransactionTypes =
      multivalues?.response?.transaction?.values?.map((v) => v.id) || [];

    const {
      name,
      start_date,
      end_date,
      min_referees,
      status,
      reward_criteria = {},
    } = req.body;

    // Destructure reward_criteria
    const {
      reward_amount,
      currency,
      onBoarding,
      transaction_flow,
      transaction,
    } = reward_criteria;

    // Validate top-level required fields
    if (!name || !start_date || !end_date || typeof min_referees !== 'number') {
      return res.status(400).json({
        res: false,
        responseError: {
          msg: 'name, start_date, end_date, and min_referees are required.',
          errCode: '19181',
          msgAPI: 'Missing required fields.',
        },
      });
    }

    // Validate reward_amount
    if (typeof reward_amount !== 'number') {
      return res.status(400).json({
        res: false,
        responseError: {
          msg: 'Invalid reward_amount in reward_criteria. Must be a number.',
          errCode: '19183',
          msgAPI: 'Invalid reward_criteria.',
        },
      });
    }

    // Validate currency based on fetchMultivalues
    if (!currency || !validCurrencies.includes(currency)) {
      return res.status(400).json({
        res: false,
        responseError: {
          msg: 'Invalid currency. Must be one of: ' + validCurrencies.join(', '),
          errCode: '19183',
          msgAPI: 'Invalid reward_criteria.',
        },
      });
    }

    // onBoarding (eKYC) is optional; if provided, must be boolean
    if (onBoarding !== undefined && typeof onBoarding !== 'boolean') {
      return res.status(400).json({
        res: false,
        responseError: {
          msg: 'onBoarding must be a boolean if provided.',
          errCode: '19183',
          msgAPI: 'Invalid reward_criteria.',
        },
      });
    }

    // If transaction_flow is provided, validate it
    if (transaction_flow) {
      const { debitOrCredit, min_amount } = transaction_flow;

      // debitOrCredit must match the valid enum from multivalues
      if (debitOrCredit && !validDebitOrCredit.includes(debitOrCredit)) {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: `transaction_flow.debitOrCredit must be one of: ${validDebitOrCredit.join(', ')}`,
            errCode: '19183',
            msgAPI: 'Invalid reward_criteria.',
          },
        });
      }

      // min_amount must be a number if provided
      if (min_amount !== undefined && typeof min_amount !== 'number') {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'transaction_flow.min_amount must be a number if provided.',
            errCode: '19183',
            msgAPI: 'Invalid reward_criteria.',
          },
        });
      }
    }

    // If transaction is provided, validate it
    if (transaction) {
      const { transaction_type, min_count } = transaction;

      // Validate transaction_type if provided
      if (transaction_type && Array.isArray(transaction_type)) {
        const hasInvalidType = transaction_type.some(
          (type) => !validTransactionTypes.includes(type)
        );
        if (hasInvalidType) {
          return res.status(400).json({
            res: false,
            responseError: {
              msg: `One or more transaction_type values are invalid. Must be among: ${validTransactionTypes.join(
                ', '
              )}`,
              errCode: '19183',
              msgAPI: 'Invalid reward_criteria.',
            },
          });
        }
      } else if (transaction_type && !Array.isArray(transaction_type)) {
        // If it's present but not an array
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'transaction.transaction_type must be an array of valid strings if provided.',
            errCode: '19183',
            msgAPI: 'Invalid reward_criteria.',
          },
        });
      }

      // min_count must be a number if provided
      if (min_count !== undefined && typeof min_count !== 'number') {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'transaction.min_count must be a number if provided.',
            errCode: '19183',
            msgAPI: 'Invalid reward_criteria.',
          },
        });
      }
    }

    // Validate start/end dates
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        res: false,
        responseError: {
          msg: 'Start date must be earlier than end date.',
          errCode: '19182',
          msgAPI: 'Invalid date range.',
        },
      });
    }
    
    // *********************************
    // REMOVED CHECK FOR UNIQUE ACTIVE CAMPAIGN
    // *********************************


    const finalStatus = computeCampaignStatus(start_date, end_date);
    if (finalStatus === 'active') {
      const activeCampaign = await Campaign.findOne({ status: 'active' });
      if (activeCampaign) {
        return res.status(400).json({
          res: false,
          responseError: {
            msg: 'An active campaign already exists. Only one active campaign at a time.',
            errCode: '19186',
            msgAPI: 'Duplicate active campaign.',
          },
        });
      }
    }



    // Prepare the new Campaign
    const campaign = new Campaign({
      campaign_id: uuidv4(),
      name: name.trim(),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      min_referees,
      reward_criteria: {
        reward_amount,
        currency,
        onBoarding: !!onBoarding,
        transaction_flow: transaction_flow || {},
        transaction: transaction || {},
      },
      status: finalStatus,
    });

    // Save the campaign to DB
    const savedCampaign = await campaign.save();
    return res.status(201).json({
      res: true,
      response: {
        campaignId: savedCampaign.campaign_id,
        message: 'Campaign created successfully.',
      },
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({
      res: false,
      responseError: {
        msg: 'Internal server error.',
        errCode: '19186',
        msgAPI: 'Failed to create campaign.',
      },
    });
  }
};



// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}, {
      name: 1,
      start_date: 1,
      end_date: 1,
      reward_criteria: 1,
      status: 1,
      min_referees: 1,
      campaign_id: 1
    });
    res.status(200).json({
      res: true,
      response: campaigns
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      res: false,
      responseError: {
        msg: 'Internal server error.',
        errCode: '19187',
        msgAPI: 'Failed to fetch campaigns.'
      }
    });
  }
};


// Get a campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findOne({ campaign_id: campaignId });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = req.body;

    const campaign = await Campaign.findOneAndUpdate(
      { campaign_id: campaignId },
      { $set: updates },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign updated successfully', campaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findOneAndDelete({ _id: campaignId });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({
      res: true,
      response: {
        msg: 'Campaign deleted successfully.',
      },
    });
    
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//get metadata
exports.getMetaData = async (req, res) => {
  try {
    // Fetch all campaigns with their associated referrals
    const campaigns = await Campaign.find({}, {
      name: 1,
      start_date: 1,
      end_date: 1,
      reward_criteria: 1,
      status: 1,
      min_referees: 1,
      campaign_id: 1
    }).lean();

    // Fetch all referrals and group them by campaign_id
    const referrals = await Referral.find({}).lean();

    const referralsByCampaign = referrals.reduce((acc, referral) => {
      const campaignId = referral.campaign_id.toString();
      if (!acc[campaignId]) acc[campaignId] = [];
      acc[campaignId].push(referral);
      return acc;
    }, {});

    // Process campaigns and build metadata
    const metadata = campaigns.map((campaign) => {
      const campaignReferrals = referralsByCampaign[campaign._id.toString()] || [];
      const totalReferrals = campaignReferrals.length;
      const totalReferees = campaignReferrals.reduce((sum, referral) => sum + referral.referees.length, 0);
      const totalCompleted = campaignReferrals.reduce(
        (sum, referral) => sum + referral.referees.filter((r) => r.status).length,
        0
      );

      return {
        campaign_id: campaign.campaign_id,
        name: campaign.name,
        status: campaign.status,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        reward_type: `${campaign.reward_criteria.reward_amount} ${campaign.reward_criteria.currency}`,
        eligibility_criteria: buildEligibilityCriteria(campaign.reward_criteria),
        total_referrals: totalReferrals,
        total_referees: totalReferees,
        total_completed: totalCompleted
      };
    });

    // Send the response
    res.status(200).json({
      res: true,
      response: metadata,
    });
  } catch (error) {
    console.error('Error fetching meta data:', error);
    res.status(500).json({
      res: false,
      responseError: {
        msg: 'Internal server error.',
        errCode: '19187',
        msgAPI: 'Failed to fetch metadata for reports.',
      },
    });
  }
};


exports.exportCampaignCsv = async (req, res) => {
  try {
    const { campaignId } = req.params;

    console.log(`[INFO] Received request to export campaign report. Campaign ID: ${campaignId}`);

    // 1. Find the campaign by its MongoDB _id
    const campaign = await Campaign.findOne({ _id: campaignId }).lean();
    if (!campaign) {
      console.error(`[ERROR] Campaign not found for campaign_id: ${campaignId}`);
      return res.status(404).json({
        res: false,
        responseError: {
          msg: 'Campaign not found.',
          errCode: '19187',
          msgAPI: 'Invalid campaign ID.',
        },
      });
    }
    console.log(`[INFO] Campaign found: ${campaign.name} (ID: ${campaign._id})`);

    // 2. Fetch referrals for the campaign
    const referrals = await Referral.find({ campaign_id: campaign._id }).lean();
    console.log(`[INFO] Found ${referrals.length} referrals for campaign: ${campaign.name}`);

    // 3. Build the CSV data
    const csvData = referrals.map((referral) => ({
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.name,
      start_date: campaign.start_date.toISOString(),
      end_date: campaign.end_date.toISOString(),
      referral_code: referral.referral_code,
      referrer_phone: referral.referrer_phone,
      total_referees: referral.referees.length,
      total_completed: referral.referees.filter((r) => r.status).length,
    }));

    // Log CSV data for debugging (show first 5 rows)
    console.log(`[DEBUG] CSV Data Preview:`, csvData.slice(0, 5));

    // 4. Convert JSON to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    console.log(`[INFO] Successfully generated CSV for campaign: ${campaign.name}`);

    // 5. Create a structured JSON response
    const responseData = {
      campaign: {
        campaign_id: campaign.campaign_id,
        campaign_name: campaign.name,
        start_date: campaign.start_date.toISOString(),
        end_date: campaign.end_date.toISOString(),
        total_referrals: referrals.length,
        total_referees: referrals.reduce((sum, referral) => sum + referral.referees.length, 0),
        total_completed: referrals.reduce(
          (sum, referral) => sum + referral.referees.filter((r) => r.status).length,
          0
        ),
      },
      csv_preview: csvData.slice(0, 5), // Provide the first 5 rows as a JSON preview
    };

    // Send the structured JSON response
    res.header('Content-Type', 'text/csv');
    res.attachment(`campaign_${campaignId}_report.csv`);

    // Send the JSON response along with the CSV file
    console.log(`[INFO] Sending JSON response and CSV attachment for campaign: ${campaign.name}`);
    res.status(200).json({
      res: true,
      response: responseData,
    });
  } catch (error) {
    console.error(`[ERROR] Error exporting campaign report:`, error);

    return res.status(500).json({
      res: false,
      responseError: {
        msg: 'Failed to export campaign data.',
        errCode: '19201',
        msgAPI: 'System error while exporting campaign report.',
      },
    });
  }
};