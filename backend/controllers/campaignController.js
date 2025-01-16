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
      const { name, start_date, end_date, reward_criteria, status } = req.body;

      // Validate required fields
      if (!name || !start_date || !end_date || !reward_criteria) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'Name, start_date, end_date, and reward_criteria are required.',
                  errCode: '19181',
                  msgAPI: 'Missing required fields.',
              },
          });
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

      // Fetch multivalues for validation
      const multivalues = await fetchMultivalues();
      const validCurrencies = multivalues.response.currency.values.map(item => item.id);
      const validTransactionTypes = multivalues.response.transaction.values.map(item => item.id);
      const validDebitOrCredit = multivalues.response.debitOrCredit.values.map(item => item.id);

      // Validate reward_criteria
      const { onBoarding, transaction } = reward_criteria;

      // Validate onBoarding reward
      if (!onBoarding || typeof onBoarding.reward !== 'number' || onBoarding.reward < 0) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'Invalid onboarding reward criteria.',
                  errCode: '19183',
                  msgAPI: 'Onboarding reward must be a non-negative number.',
              },
          });
      }

     // Validate transaction reward
if (!transaction) {
  console.debug('Validation Failed: Transaction object is missing.');
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: 'Transaction object is required.',
      },
  });
}

if (typeof transaction.minAmount !== 'number') {
  console.debug('Validation Failed: transaction.minAmount is not a number.');
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: 'Transaction minAmount must be a number.',
      },
  });
}

if (transaction.minAmount < 0) {
  console.debug('Validation Failed: transaction.minAmount is negative.');
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: 'Transaction minAmount cannot be negative.',
      },
  });
}

if (typeof transaction.reward !== 'number') {
  console.debug('Validation Failed: transaction.reward is not a number.');
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: 'Transaction reward must be a number.',
      },
  });
}

if (transaction.reward < 0) {
  console.debug('Validation Failed: transaction.reward is negative.');
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: 'Transaction reward cannot be negative.',
      },
  });
}

if (!validCurrencies.includes(transaction.currency)) {
  console.debug(`Validation Failed: transaction.currency '${transaction.currency}' is not supported.`);
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: `Unsupported currency '${transaction.currency}'. Supported currencies: ${validCurrencies.join(', ')}.`,
      },
  });
}

if (!validTransactionTypes.includes(transaction.transaction_type)) {
  console.debug(`Validation Failed: transaction.transaction_type '${transaction.transaction_type}' is not supported.`);
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: `Unsupported transaction type '${transaction.transaction_type}'. Supported transaction types: ${validTransactionTypes.join(', ')}.`,
      },
  });
}

if (!validDebitOrCredit.includes(transaction.debitOrCredit)) {
  console.debug(`Validation Failed: transaction.debitOrCredit '${transaction.debitOrCredit}' is not supported.`);
  return res.status(400).json({
      res: false,
      responseError: {
          msg: 'Invalid transaction reward criteria.',
          errCode: '19184',
          msgAPI: `Unsupported debitOrCredit value '${transaction.debitOrCredit}'. Supported values: ${validDebitOrCredit.join(', ')}.`,
      },
  });
}


      // Check for existing campaign with the same name
      const existingCampaign = await Campaign.findOne({ name: name.trim() });
      if (existingCampaign) {
          return res.status(400).json({
              res: false,
              responseError: {
                  msg: 'A campaign with this name already exists.',
                  errCode: '19185',
                  msgAPI: 'Duplicate campaign name.',
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
      });

      await campaign.save();
      return res.status(201).json({
          res: true,
          response: {
              campaignId: campaign.campaign_id,
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
    const campaigns = await Campaign.find({});
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Internal server error' });
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
