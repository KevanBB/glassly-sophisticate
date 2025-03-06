
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import GlassPanel from '@/components/ui/GlassPanel';
import { Loader2, Users, Clock, RefreshCw, LineChart, BarChart, PieChart, Activity, Server, FileSearch, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import DashboardCard from '@/components/dashboard/DashboardCard';

// Mock data for the analytics dashboard
// In a real application, this would come from your backend analytics service
const mockUserEngagementData = [
  { date: 'Jan', DAU: 120, MAU: 450 },
  { date: 'Feb', DAU: 140, MAU: 480 },
  { date: 'Mar', DAU: 160, MAU: 520 },
  { date: 'Apr', DAU: 180, MAU: 550 },
  { date: 'May', DAU: 210, MAU: 600 },
  { date: 'Jun', DAU: 250, MAU: 650 },
  { date: 'Jul', DAU: 280, MAU: 700 },
];

const mockSessionData = [
  { date: 'Mon', avgDuration: 15, sessions: 210 },
  { date: 'Tue', avgDuration: 18, sessions: 230 },
  { date: 'Wed', avgDuration: 20, sessions: 250 },
  { date: 'Thu', avgDuration: 17, sessions: 240 },
  { date: 'Fri', avgDuration: 22, sessions: 260 },
  { date: 'Sat', avgDuration: 25, sessions: 300 },
  { date: 'Sun', avgDuration: 23, sessions: 280 },
];

const mockRetentionData = [
  { day: 'Day 1', rate: 100 },
  { day: 'Day 3', rate: 70 },
  { day: 'Day 7', rate: 55 },
  { day: 'Day 14', rate: 40 },
  { day: 'Day 30', rate: 30 },
];

const mockFeatureUsageData = [
  { name: 'Messaging', value: 35 },
  { name: 'Profiles', value: 25 },
  { name: 'Community', value: 20 },
  { name: 'Dashboard', value: 15 },
  { name: 'Other', value: 5 },
];

const mockErrorRatesData = [
  { date: 'Mon', errors: 12, requests: 1200 },
  { date: 'Tue', errors: 8, requests: 1300 },
  { date: 'Wed', errors: 15, requests: 1400 },
  { date: 'Thu', errors: 10, requests: 1250 },
  { date: 'Fri', errors: 7, requests: 1350 },
  { date: 'Sat', errors: 5, requests: 900 },
  { date: 'Sun', errors: 6, requests: 950 },
];

const mockContentEngagementData = [
  { page: 'Dashboard', views: 2500, interactions: 1800 },
  { page: 'Messages', views: 1800, interactions: 1500 },
  { page: 'Profile', views: 1500, interactions: 900 },
  { page: 'Community', views: 1200, interactions: 700 },
  { page: 'Admin', views: 500, interactions: 300 },
];

const COLORS = ['#7C90C1', '#5A6FA3', '#A8B8D8', '#DC143C', '#F0506E'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  
  useEffect(() => {
    // In a real application, you would fetch actual analytics data here
    // based on the selected time range
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        // Data would be fetched and set here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);
  
  const handleRefresh = () => {
    toast.info('Refreshing analytics data...');
    // Here you would trigger a refresh of your analytics data
  };

  if (loading) {
    return (
      <GlassPanel className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading analytics data...</span>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Analytics Dashboard
          </h2>
          <div className="flex gap-3">
            <select 
              className="bg-glass-10 text-white border border-white/10 rounded-md px-3 py-1"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="bg-transparent border-white/10 hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="userEngagement" className="w-full">
          <TabsList className="bg-glass-20 border border-white/10 w-full justify-start mb-6 overflow-x-auto">
            <TabsTrigger value="userEngagement" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="mr-2 h-4 w-4" />
              User Engagement
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Server className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileSearch className="mr-2 h-4 w-4" />
              Content Analytics
            </TabsTrigger>
          </TabsList>
          
          {/* User Engagement Tab */}
          <TabsContent value="userEngagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Users" icon={<Users className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">2,845</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  +12% from last period
                </div>
              </DashboardCard>
              
              <DashboardCard title="DAU" icon={<Activity className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">280</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  +5% from last period
                </div>
              </DashboardCard>
              
              <DashboardCard title="MAU" icon={<Users className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">700</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  +8% from last period
                </div>
              </DashboardCard>
              
              <DashboardCard title="Avg. Session Duration" icon={<Clock className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">18 min</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  +3% from last period
                </div>
              </DashboardCard>
            </div>
            
            {/* DAU/MAU Chart */}
            <DashboardCard title="Daily & Monthly Active Users" icon={<LineChart className="h-5 w-5" />}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockUserEngagementData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30,30,30,0.8)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: 'white'
                      }} 
                    />
                    <Area type="monotone" dataKey="DAU" stackId="1" stroke="#7C90C1" fill="#7C90C1" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="MAU" stackId="2" stroke="#DC143C" fill="#DC143C" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Session Data */}
              <DashboardCard title="Session Frequency" icon={<BarChart className="h-5 w-5" />}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockSessionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(30,30,30,0.8)', 
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="sessions" fill="#7C90C1" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
              
              {/* Retention Rates */}
              <DashboardCard title="User Retention Rates" icon={<BarChart className="h-5 w-5" />}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockRetentionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(30,30,30,0.8)', 
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="rate" fill="#DC143C" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
            </div>
            
            {/* Feature Usage */}
            <DashboardCard title="Feature Usage Statistics" icon={<PieChart className="h-5 w-5" />}>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={mockFeatureUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockFeatureUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30,30,30,0.8)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: 'white'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Avg Response Time" icon={<Zap className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">120 ms</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  -15% from last period
                </div>
              </DashboardCard>
              
              <DashboardCard title="Error Rate" icon={<Activity className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">0.8%</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  -0.2% from last period
                </div>
              </DashboardCard>
              
              <DashboardCard title="API Requests" icon={<Server className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">185K</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  +12% from last period
                </div>
              </DashboardCard>
              
              <DashboardCard title="Uptime" icon={<Activity className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Same as last period
                </div>
              </DashboardCard>
            </div>
            
            {/* Error Rates Chart */}
            <DashboardCard title="Error Rates & API Requests" icon={<LineChart className="h-5 w-5" />}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockErrorRatesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30,30,30,0.8)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: 'white'
                      }} 
                    />
                    <Area yAxisId="right" type="monotone" dataKey="requests" stroke="#7C90C1" fill="#7C90C1" fillOpacity={0.6} />
                    <Area yAxisId="left" type="monotone" dataKey="errors" stroke="#DC143C" fill="#DC143C" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>
          
          {/* Content Analytics Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard title="Most Viewed Page" icon={<FileSearch className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">Dashboard</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  2,500 views
                </div>
              </DashboardCard>
              
              <DashboardCard title="Most Interactive Page" icon={<Activity className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">Messages</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  1,500 interactions
                </div>
              </DashboardCard>
              
              <DashboardCard title="Engagement Rate" icon={<Activity className="h-5 w-5" />}>
                <div className="text-3xl font-bold text-white">72%</div>
                <div className="text-green-400 text-sm flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  +5% from last period
                </div>
              </DashboardCard>
            </div>
            
            {/* Content Engagement Chart */}
            <DashboardCard title="Page Views & Interactions" icon={<BarChart className="h-5 w-5" />}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={mockContentEngagementData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="page" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30,30,30,0.8)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: 'white'
                      }} 
                    />
                    <Bar dataKey="views" name="Views" fill="#7C90C1" />
                    <Bar dataKey="interactions" name="Interactions" fill="#DC143C" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </GlassPanel>
    </div>
  );
};

export default AnalyticsDashboard;
