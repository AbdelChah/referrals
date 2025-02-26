import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "./dashboard.styles";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getPerformanceMetrics } from "../../services/dashboardService";

interface PerformanceData {
  totalReferrals: number;
  totalRewardsDistributed: number;
  activeUsers: number;
  conversionRate: number | null;
  averageReferralValue: number;
}

const PerformanceGraphs: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceData | null>(null);
  useEffect(() => {
    // Fetch the performance metrics when the component mounts
    getPerformanceMetrics()
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching performance metrics:", error);
      });
  }, []);
  if (!metrics) {
    return <div>Loading...</div>;
  }
  const chartData = [
    { name: "Total Referrals", value: metrics.totalReferrals },
    {
      name: "Total Rewards Distributed",
      value: metrics.totalRewardsDistributed,
    },
  ];
  return (
    <Card>
      <CardTitle>Performance Metrics</CardTitle>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Optionally, display the raw values */}
      <div>
        <div>Total Referrals: {metrics.totalReferrals}</div>
        <div>Total Rewards Distributed: {metrics.totalRewardsDistributed}</div>
        <div>Active Users: {metrics.activeUsers}</div>
        <div>Conversion Rate: {metrics.conversionRate}</div>
        <div>Average Referral Value: {metrics.averageReferralValue}</div>
      </div>
    </Card>
  );
};

export default PerformanceGraphs;
