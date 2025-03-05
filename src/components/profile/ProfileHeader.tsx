
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';

interface ProfileHeaderProps {
  profile: any;
  user: any;
}

const ProfileHeader = ({ profile, user }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-4xl z-10 mb-6"
    >
      <GlassPanel className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="text-white/80 hover:text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <h1 className="text-xl font-semibold text-white">Profile Management</h1>
        
        <div className="w-10" /> {/* Spacer for alignment */}
      </GlassPanel>
    </motion.div>
  );
};

export default ProfileHeader;
