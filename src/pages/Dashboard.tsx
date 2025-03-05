
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardBackground from '@/components/dashboard/DashboardBackground';
import DashboardContent from '@/components/dashboard/DashboardContent';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import TributeActions from '@/components/dashboard/TributeActions';
import { useDashboardTime } from '@/hooks/useDashboardTime';
import { useUserProfile } from '@/hooks/useUserProfile';
import { mockNotifications, mockActivity, mockMatches, quickActions, recentTributes } from '@/data/dashboardMockData';

const Dashboard = () => {
  const { user } = useAuth();
  const { time, backgroundClass } = useDashboardTime();
  const profile = useUserProfile(user);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-6 overflow-x-hidden"
    >
      <DashboardBackground backgroundClass={backgroundClass} />
      
      <DashboardHeader profile={profile} user={user} time={time} />
      
      <DashboardContent 
        notifications={mockNotifications}
        activities={mockActivity}
        matches={mockMatches}
        quickActions={quickActions}
        recentTributes={recentTributes}
      />
      
      <TributeActions />
      
      <BottomNavigation />
    </motion.div>
  );
};

export default Dashboard;
