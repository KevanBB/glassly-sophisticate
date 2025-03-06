
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardBackground from '@/components/dashboard/DashboardBackground';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassPanel from '@/components/ui/GlassPanel';
import { Loader2, Users, Activity, Settings, Shield, LineChart } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import ActivityLog from '@/components/admin/ActivityLog';
import AdminSettings from '@/components/admin/AdminSettings';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/dashboard');
          return;
        }

        if (data.role !== 'admin') {
          navigate('/dashboard');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Checking admin privileges...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This should never render since we navigate away if not admin
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-8 overflow-x-hidden"
    >
      <DashboardBackground backgroundClass="dark-gradient" />
      
      <div className="w-full max-w-6xl z-10 space-y-6 mb-20">
        <GlassPanel className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-white/70">
            Manage users, monitor activity, and configure system settings.
          </p>
        </GlassPanel>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="bg-glass-20 border border-white/10 w-full justify-start mb-6 overflow-x-auto">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Activity className="mr-2 h-4 w-4" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityLog />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </motion.div>
  );
};

export default AdminDashboard;
