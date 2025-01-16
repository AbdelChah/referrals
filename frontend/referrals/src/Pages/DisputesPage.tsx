import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import Sidebar from '../components/Sidebar';

const DisputesPage: React.FC = () => {
  const disputes = [
    { id: 'DSP001', user: 'John Doe', type: 'Missing Reward', status: 'Open', date: '2023-07-01' },
    { id: 'DSP002', user: 'Jane Smith', type: 'Invalid Referral', status: 'Resolved', date: '2023-06-28' },
    { id: 'DSP003', user: 'Bob Johnson', type: 'Incorrect Reward Amount', status: 'In Progress', date: '2023-07-02' },
    { id: 'DSP004', user: 'Alice Brown', type: 'Delayed Reward', status: 'Open', date: '2023-07-03' },
    { id: 'DSP005', user: 'Charlie Davis', type: 'Missing Reward', status: 'Resolved', date: '2023-06-30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="ml-[250px] p-8"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Disputes Management</h1>

        <Card className="bg-white/10 backdrop-blur-lg border-none text-white mb-8">
          <CardHeader>
            <CardTitle>Recent Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">{dispute.id}</TableCell>
                    <TableCell>{dispute.user}</TableCell>
                    <TableCell>{dispute.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        dispute.status === 'Open' ? 'bg-yellow-500' :
                        dispute.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {dispute.status}
                      </span>
                    </TableCell>
                    <TableCell>{dispute.date}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add more dispute management components here */}
      </motion.div>
    </div>
  );
};

export default DisputesPage;

