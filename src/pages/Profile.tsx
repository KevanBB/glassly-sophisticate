import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AboutTab from '@/components/profile/AboutTab';
import ActivityTab from '@/components/profile/ActivityTab';
import WallTab from '@/components/profile/WallTab';
import PrivacySettings from '@/components/profile/PrivacySettings';
import SecuritySettings from '@/components/profile/SecuritySettings';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassPanel from '@/components/ui/GlassPanel';
import { Shield, Lock, User, Activity, MessageSquare, Settings, Award, PenSquare } from 'lucide-react';
import BadgesDisplay from '@/components/profile/BadgesDisplay';
import PrivateNotes from '@/components/profile/PrivateNotes';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { user } = useAuth();
  const profile = useUserProfile(user);
  const [currentTab, setCurrentTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);

  // User activity tracking - update on page load and tab changes
  useEffect(() => {
    if (!user) return;

    // Update user's activity status
    const updateActivity = async () => {
      try {
        const now = new Date().toISOString();
        await supabase
          .from('profiles')
          .update({ 
            last_active: now,
            is_active: true 
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating activity status:', error);
      }
    };

    // Update activity on page load
    updateActivity();

    // Set up periodic activity updates
    const activityInterval = setInterval(updateActivity, 60000); // Every minute

    // Cleanup function
    return () => {
      clearInterval(activityInterval);
    };
  }, [user]);

  // Update activity when tab changes
  useEffect(() => {
    if (!user) return;
    
    const updateActivity = async () => {
      try {
        const now = new Date().toISOString();
        await supabase
          .from('profiles')
          .update({ 
            last_active: now,
            is_active: true 
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating activity status:', error);
      }
    };
    
    updateActivity();
  }, [currentTab, user]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-6 pb-20 overflow-x-hidden"
    >
      {/* Background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-200 to-dark z-0" />
      
      <ProfileHeader 
        profile={profile} 
        user={user} 
        isEditing={isEditing} 
        isOwnProfile={true}
        onToggleEdit={toggleEditMode} 
      />
      
      <div className="w-full max-w-4xl z-10 mb-20">
        <GlassPanel className="p-6 mb-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="about" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity size={16} />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="wall" className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span className="hidden sm:inline">Wall</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award size={16} />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock size={16} />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <AboutTab 
                profile={profile} 
                user={user} 
                isEditing={isEditing}
                isOwnProfile={true} 
                onSave={() => setIsEditing(false)} 
              />
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityTab profile={profile} user={user} />
            </TabsContent>
            
            <TabsContent value="wall">
              <WallTab profile={profile} user={user} isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="badges">
              <BadgesDisplay userId={user?.id} isOwnProfile={true} />
              
              <div className="mt-6">
                <PrivateNotes userId={user?.id} />
              </div>
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
