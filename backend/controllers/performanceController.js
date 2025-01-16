const Referral = require('../models/Referrals');
const Rewards = require('../models/Rewards');
const { v4: uuidv4 } = require('uuid');

// Fetch performance metrics
exports.getPerformanceMetrics = async (req, res) => {
  try {
      // Total number of referrals
      const totalReferrals = await Referral.countDocuments();

      // Total rewards distributed (count of claimed rewards)
      const totalRewardsDistributed = await Referral.aggregate([
          { $unwind: '$referees' },
          {
              $project: {
                  rewardsCount: {
                      $sum: [
                          { $cond: ['$referees.rewards.onBoarding', 1, 0] }, // Count onboarding rewards
                          { $cond: ['$referees.rewards.transaction', 1, 0] }, // Count transaction rewards
                      ],
                  },
              },
          },
          { $group: { _id: null, total: { $sum: '$rewardsCount' } } },
      ]);

      // Active users (unique referrers with at least one referee)
      const activeUsers = await Referral.aggregate([
          { $unwind: '$referees' },
          { $group: { _id: '$referrer_phone' } },
          { $count: 'activeUsers' },
      ]);

      // Successful referrals (count of referees with completed actions)
      const successfulReferrals = await Referral.aggregate([
          { $unwind: '$referees' },
          { $unwind: '$referees.actions' },
          { $match: { 'referees.actions.status': 'rewarded' } },
          { $count: 'successfulReferrals' },
      ]);

      // Conversion rate
      const conversionRate = totalReferrals
          ? (successfulReferrals[0]?.successfulReferrals / totalReferrals).toFixed(2)
          : 0;

      // Average referral value
      const averageReferralValue = successfulReferrals[0]?.successfulReferrals
          ? (
                (totalRewardsDistributed[0]?.total || 0) / successfulReferrals[0]?.successfulReferrals
            ).toFixed(2)
          : 0;

      res.json({
          totalReferrals,
          totalRewardsDistributed: totalRewardsDistributed[0]?.total || 0,
          activeUsers: activeUsers[0]?.activeUsers || 0,
          conversionRate: parseFloat(conversionRate),
          averageReferralValue: parseFloat(averageReferralValue),
      });
  } catch (error) {
      console.error('Error fetching performance metrics:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



// Fetch referral summary
exports.getReferralSummary = async (req, res) => {
  try {
    const referralSummary = await Referral.aggregate([
      {
        $group: {
          _id: '$referrer_phone',
          referrals: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'rewards',
          localField: '_id',
          foreignField: 'referrer_phone',
          as: 'rewards',
        },
      },
      {
        $project: {
          userId: '$_id',
          referrals: 1,
          totalRewards: { $sum: '$rewards.amount' },
        },
      },
    ]);

    res.json(referralSummary);
  } catch (error) {
    console.error('Error fetching referral summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate a report
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.body;

    if (!startDate || !endDate || !reportType) {
      return res.status(400).json({ error: 'Start date, end date, and report type are required' });
    }

    const reportId = uuidv4();

    // Simulate asynchronous report generation
    const estimatedCompletionTime = new Date();
    estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + 2);

    // In a real application, store report metadata in the database
    const report = {
      reportId,
      status: 'Generating',
      estimatedCompletionTime,
    };

    res.status(201).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch a generated report
exports.getGeneratedReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Simulate fetching the report from storage or database
    const report = {
      reportId,
      status: 'Completed',
      data: {
        totalReferrals: 1500,
        totalRewardsDistributed: 5000,
        conversionRate: 0.75,
        averageReferralValue: 25,
        referralDetails: [
          { userId: 'UUID1', referrals: 10, totalRewards: 250 },
          { userId: 'UUID2', referrals: 5, totalRewards: 150 },
        ],
      },
    };

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
