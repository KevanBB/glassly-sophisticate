
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import PrivacySettings from '@/components/profile/PrivacySettings';
import SecuritySettings from '@/components/profile/SecuritySettings';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassPanel from '@/components/ui/GlassPanel';

const ProfilePage = () => {
  const { user } = useAuth();
  const profile = useUserProfile(user);
  const [currentTab, setCurrentTab] = useState("general");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-6 overflow-x-hidden"
    >
      {/* Background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-200 to-dark z-0" />
      
      <ProfileHeader profile={profile} user={user} />
      
      <div className="w-full max-w-4xl z-10 mb-20">
        <GlassPanel className="p-6 mb-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">Profile</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <ProfileContent profile={profile} user={user} />
            </TabsContent>
            
            <TabsContent value="privacy">
              <PrivacySettings profile={profile} user={user} />
            </TabsContent>
            
            <TabsContent value="security">
              <SecuritySettings profile={profile} user={user} />
            </TabsContent>
          </Tabs>
        </GlassPanel>
      </div>
      
      <BottomNavigation />
    </motion.div>
  );
};

export default ProfilePage;
