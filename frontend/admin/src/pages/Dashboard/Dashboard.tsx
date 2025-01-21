import React from 'react';
import { Container, Title, MetricContainer } from './dashboard.styles';
// import ReferralMetrics from './ReferralMetrics';
import PerformanceGraphs from './PerformanceGraphs';
// import RewardDistribution from './RewardDistribution';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Title>Dashboard</Title>

      <MetricContainer>
        {/* <ReferralMetrics /> */}
        <PerformanceGraphs />
        {/* <RewardDistribution /> */}
      </MetricContainer>
    </Container>
  );
};

export default Dashboard;
