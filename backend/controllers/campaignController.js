const axios = require('axios');
const Campaign = require('../models/Campaign');
const { v4: uuidv4 } = require('uuid');

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

exports.createCampaign = async (req, res) => {
  try {
      const { name, start_date, end_date, reward_criteria, status, min_referees } = req.body;

      console.log("Request body:", req.body);

      // Validate required fields
      if (!name || !start_date || !end_date || !reward_criteria || typeof min_referees !== 'number') {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'Name, start_date, end_date, reward_criteria, and min_referees are required.',
                  errCode: '19181',
                  msgAPI: 'Missing required fields.',
              },
          });
      }

      // Ensure at least one of onBoarding or transaction is provided in reward_criteria
      if (!reward_criteria.onBoarding && !reward_criteria.transaction) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'At least one of onBoarding or transaction criteria must be provided.',
                  errCode: '19183',
                  msgAPI: 'Invalid reward_criteria.',
              },
          });
      }

      // Validate onBoarding criteria
      if (reward_criteria.onBoarding && typeof reward_criteria.onBoarding.reward !== 'number') {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'Invalid reward_criteria for onboarding. Reward must be a number.',
                  errCode: '19183',
                  msgAPI: 'Invalid reward_criteria.',
              },
          });
      }

      // Validate transaction criteria
      if (reward_criteria.transaction) {
          const { minAmount, reward, currency, count, transaction_type, debitOrCredit } = reward_criteria.transaction;

          if (
              typeof minAmount !== 'number' ||
              typeof reward !== 'number' ||
              typeof count !== 'number' ||
              !currency ||
              (transaction_type && debitOrCredit) // Ensure transaction_type and debitOrCredit are exclusive
          ) {
              return res.status(400).json({
                  res: false,
                  responseError: {
                      msg: 'Invalid reward_criteria for transaction. Check fields and exclusivity of transaction_type and debitOrCredit.',
                      errCode: '19183',
                      msgAPI: 'Invalid reward_criteria.',
                  },
              });
          }
      }

      // Validate date range
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

      // Ensure only one active campaign exists
      const activeCampaign = await Campaign.findOne({ status: 'active' });
      if (activeCampaign) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'An active campaign already exists. Only one campaign is allowed at a time.',
                  errCode: '19186',
                  msgAPI: 'Duplicate active campaign.',
              },
          });
      }

      // Create new campaign
      const campaign = new Campaign({
          campaign_id: uuidv4(),
          name: name.trim(),
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          reward_criteria,
          status: status || 'active',
          min_referees,
      });

      const savedCampaign = await campaign.save();
      console.log("Saved Campaign:", savedCampaign);

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

    const campaign = await Campaign.findOneAndDelete({ campaign_id: campaignId });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
