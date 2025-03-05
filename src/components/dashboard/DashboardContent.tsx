
import React from 'react';
import { motion } from 'framer-motion';
import NotificationCard from './NotificationCard';
import ActivityCard from './ActivityCard';
import MatchesCard from './MatchesCard';
import QuickActionsCard from './QuickActionsCard';
import TributeCard from './TributeCard';

interface DashboardContentProps {
  notifications: any[];
  activities: any[];
  matches: any[];
  quickActions: any[];
  recentTributes: any[];
}

const DashboardContent = ({
  notifications,
  activities,
  matches,
  quickActions,
  recentTributes
}: DashboardContentProps) => {
  return (
    <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-1 md:col-span-2"
      >
        <QuickActionsCard actions={quickActions} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <NotificationCard notifications={notifications} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ActivityCard activities={activities} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <TributeCard recentTributes={recentTributes} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="col-span-1 md:col-span-2"
      >
        <MatchesCard matches={matches} />
      </motion.div>
    </main>
  );
};

export default DashboardContent;
