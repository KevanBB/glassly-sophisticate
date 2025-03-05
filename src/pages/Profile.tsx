
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

// Create a new user_notes table in Supabase when loading the page
const ensureUserNotesTable = async () => {
  try {
    // Check if the table exists
    const { error } = await supabase
      .from('user_notes')
      .select('id')
      .limit(1);
    
    // If there's an error, it might mean the table doesn't exist
    if (error && error.code === '42P01') {
      console.log('Creating user_notes table');
      // Table doesn't exist, create it
      await supabase.rpc('create_user_notes_table');
    }
  } catch (error) {
    console.error('Error checking or creating user_notes table:', error);
  }
};

const ProfilePage = () => {
  const { user } = useAuth();
  const profile = useUserProfile(user);
  const [currentTab, setCurrentTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    if (user && profile) {
      setIsOwnProfile(user.id === profile.id);
      // Create the user_notes table if it doesn't exist
      ensureUserNotesTable();
    }
  }, [user, profile]);

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
              <BadgesDisplay userId={user?.id} isOwnProfile={isOwnProfile} />
              
              {isOwnProfile && (
                <div className="mt-6">
                  <PrivateNotes userId={user?.id} />
                </div>
              )}
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
