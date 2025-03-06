
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { StripeConnectProvider } from '@/components/payments/StripeConnectProvider';
import { useStripeConnectContext } from '@/components/payments/StripeConnectProvider';
import { RefreshCw, Settings, BarChart, Users, FileText } from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = useUserProfile(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCreatorStatus = async () => {
      if (!user) return;

      try {
        const { data: creatorProfile, error } = await supabase
          .from('profiles')
          .select('is_creator, creator_onboarding_complete, creator_username')
          .eq('id', user.id)
          .single();

        if (error || !creatorProfile?.is_creator) {
          navigate('/dashboard');
          return;
        }

        if (!creatorProfile.creator_onboarding_complete) {
          navigate('/creator/onboarding');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking creator status:', error);
        setLoading(false);
      }
    };

    checkCreatorStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  return (
    <StripeConnectProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen p-4 md:p-6"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <DashboardHeader username={profile?.creator_username} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsPanel />
            <StripeStatusPanel />
            <ContentQuickActions />
          </div>
        </div>
      </motion.div>
    </StripeConnectProvider>
  );
};

const DashboardHeader = ({ username }: { username?: string }) => {
  return (
    <GlassPanel className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
          {username && (
            <p className="text-white/70">
              @{username}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </GlassPanel>
  );
};

const StatsPanel = () => {
  // Mock stats for now
  const stats = {
    subscribers: 0,
    revenue: 0,
    views: 0
  };

  return (
    <GlassPanel className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Subscribers</span>
          <span className="text-white font-medium">{stats.subscribers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Revenue</span>
          <span className="text-white font-medium">${stats.revenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Content Views</span>
          <span className="text-white font-medium">{stats.views}</span>
        </div>
      </div>
    </GlassPanel>
  );
};

const StripeStatusPanel = () => {
  const { isOnboarded, refreshAccount, loading } = useStripeConnectContext();
  
  return (
    <GlassPanel className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Payment Status</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={refreshAccount}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isOnboarded ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-white">
            {isOnboarded ? 'Stripe account active' : 'Stripe setup incomplete'}
          </span>
        </div>
        
        {!isOnboarded && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/creator/onboarding?step=4'}
            className="mt-2"
          >
            Complete Setup
          </Button>
        )}
      </div>
    </GlassPanel>
  );
};

const ContentQuickActions = () => {
  return (
    <GlassPanel className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <FileText className="h-6 w-6 mb-2" />
          <span>New Post</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <BarChart className="h-6 w-6 mb-2" />
          <span>Analytics</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <Users className="h-6 w-6 mb-2" />
          <span>Subscribers</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <Settings className="h-6 w-6 mb-2" />
          <span>Settings</span>
        </Button>
      </div>
    </GlassPanel>
  );
};

export default CreatorDashboard;
