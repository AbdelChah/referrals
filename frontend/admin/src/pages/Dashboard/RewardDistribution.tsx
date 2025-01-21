import React from 'react';
import { Card, CardTitle } from './dashboard.styles';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Cashback', value: 400 },
  { name: 'Points', value: 300 },
  { name: 'Vouchers', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RewardDistribution: React.FC = () => {
  return (
    <Card>
      <CardTitle>Reward Distribution</CardTitle>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RewardDistribution;
