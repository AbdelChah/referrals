import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { referralTrends, rewardDistribution, referralStatus } from '../data/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const handleExportData = () => {
    console.log('Exporting data...');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Referral Program Dashboard</h1>
        <Button onClick={handleExportData} className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle>Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,234</p>
            <p className="text-sm text-green-400">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">5</p>
            <p className="text-sm text-yellow-400">1 ending soon</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle>Total Rewards Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">$12,345</p>
            <p className="text-sm text-green-400">+10.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle>Referral Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">68%</p>
            <p className="text-sm text-red-400">-2.3% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle>Referral Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={referralTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff20', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="referrals" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle>Reward Distribution Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rewardDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {rewardDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff20', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white/10 backdrop-blur-lg border-none text-white mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Referral Status</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-[180px] bg-white/10 text-white border-none">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="summer">Summer Promo</SelectItem>
                <SelectItem value="fall">Fall Kickoff</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[240px] justify-start text-left font-normal bg-white/10 text-white border-none`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2">Referral ID</th>
                  <th className="text-left p-2">Referrer</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Reward</th>
                </tr>
              </thead>
              <tbody>
                {referralStatus.map((referral: { id: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.Key | null | undefined; referrer: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; date: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; status: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; reward: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                  <tr Key={referral.id} className="border-b border-white/10">
                    <td className="p-2">{referral.id}</td>
                    <td className="p-2">{referral.referrer}</td>
                    <td className="p-2">{referral.date}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        referral.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="p-2">{referral.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
        <CardHeader>
          <CardTitle>Performance KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/70">Successful Referrals</p>
              <p className="text-2xl font-bold">842</p>
              <p className="text-sm text-green-400">+12% from last month</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Pending Rewards</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-yellow-400">-3% from last month</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Active Referrals</p>
              <p className="text-2xl font-bold">1,023</p>
              <p className="text-sm text-green-400">+8% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardPage;

