import React from 'react';
import { Card, CardTitle, CardValue } from './dashboard.styles';

const ReferralMetrics: React.FC = () => {
  return (
    <Card>
      <CardTitle>Referral Metrics</CardTitle>
      <div>
        <CardValue>Total Referrals: 150</CardValue>
        <CardValue>Active Campaigns: 5</CardValue>
        <CardValue>Total Rewards Distributed: $1000</CardValue>
      </div>
    </Card>
  );
};

export default ReferralMetrics;
