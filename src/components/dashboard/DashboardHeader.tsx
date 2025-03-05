
import React from 'react';
import { motion } from 'framer-motion';
import UserMenu from './UserMenu';

interface DashboardHeaderProps {
  profile: any;
  user: any;
  time: Date;
}

const DashboardHeader = ({ profile, user, time }: DashboardHeaderProps) => {
  return (
    <header className="w-full max-w-4xl flex justify-between items-center mb-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center"
      >
        <UserMenu profile={profile} user={user} />
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-white">
            {profile ? `Welcome, ${profile.first_name}` : 'Dashboard'}
          </h1>
          <p className="text-sm text-white/60">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </motion.div>
    </header>
  );
};

export default DashboardHeader;
