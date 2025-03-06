
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { StripeConnectProvider } from '@/components/payments/StripeConnectProvider';
import DashboardHeader from '@/components/creator/dashboard/DashboardHeader';
import StatsPanel from '@/components/creator/dashboard/StatsPanel';
import StripeStatusPanel from '@/components/creator/dashboard/StripeStatusPanel';
import ContentQuickActions from '@/components/creator/dashboard/ContentQuickActions';
import LoadingSpinner from '@/components/creator/dashboard/LoadingSpinner';
import StripeAccountManagement from '@/components/payments/StripeAccountManagement';

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
    return <LoadingSpinner />;
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
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Advanced Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StripeAccountManagement />
              {/* Additional admin panels can be added here */}
            </div>
          </div>
        </div>
      </motion.div>
    </StripeConnectProvider>
  );
};

export default CreatorDashboard;
