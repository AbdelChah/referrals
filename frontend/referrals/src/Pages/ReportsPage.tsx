import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ReportsPage: React.FC = () => {
  const campaignData = [
    { name: 'Summer Promo', referrals: 400, conversions: 300 },
    { name: 'Fall Kickoff', referrals: 300, conversions: 200 },
    { name: 'Holiday Special', referrals: 500, conversions: 350 },
    { name: 'New Year Boost', referrals: 200, conversions: 150 },
  ];

  const handleExportReport = () => {
    // Implement export logic here
    console.log('Exporting report...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="ml-[250px] p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Reports</h1>
          <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-none text-white mb-8">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff20', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="referrals" fill="#8884d8" name="Referrals" />
                <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Add more report components here */}
      </motion.div>
    </div>
  );
};

export default ReportsPage;

