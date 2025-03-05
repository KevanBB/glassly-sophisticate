
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AboutTab from '@/components/profile/AboutTab';
import ActivityTab from '@/components/profile/ActivityTab';
import WallTab from '@/components/profile/WallTab';
import BadgesDisplay from '@/components/profile/BadgesDisplay';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import { usePublicUserProfile } from '@/hooks/usePublicUserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassPanel from '@/components/ui/GlassPanel';
import { User, Activity, MessageSquare, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { profile, loading, error } = usePublicUserProfile(userId);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("about");
  
  // Redirect to own profile if viewing your own profile via URL
  useEffect(() => {
    if (user && userId && user.id === userId) {
      navigate('/profile');
    }
  }, [user, userId, navigate]);

  // Don't render anything if redirecting to own profile
  if (user && userId && user.id === userId) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-6 pb-20 overflow-x-hidden"
    >
      {/* Background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-200 to-dark z-0" />
      
      {/* Back button */}
      <div className="w-full max-w-4xl z-10 mb-2">
        <Button variant="link" onClick={() => navigate(-1)} className="text-white/70 pl-0 -ml-3 hover:text-white/90">
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
      </div>
      
      {loading ? (
        <div className="w-full max-w-4xl z-10 space-y-6">
          {/* Skeleton for profile header */}
          <div className="h-64 rounded-xl bg-white/5 animate-pulse"></div>
          <div className="h-12 w-32 bg-white/5 rounded animate-pulse mt-4 ml-32"></div>
          <GlassPanel className="p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-white/5 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-white/5 rounded"></div>
              <div className="h-20 bg-white/5 rounded"></div>
            </div>
          </GlassPanel>
        </div>
      ) : error ? (
        <div className="w-full max-w-4xl z-10 flex flex-col items-center justify-center py-20">
          <h2 className="text-xl text-white font-medium mb-2">Profile Not Available</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      ) : (
        <>
          <ProfileHeader 
            profile={profile} 
            user={user} 
            isEditing={false}
            isOwnProfile={false}
          />
          
          <div className="w-full max-w-4xl z-10 mb-20">
            <GlassPanel className="p-6 mb-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
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
                </TabsList>
                
                <TabsContent value="about">
                  <AboutTab 
                    profile={profile} 
                    user={user} 
                    isEditing={false}
                    isOwnProfile={false}
                  />
                </TabsContent>
                
                <TabsContent value="activity">
                  <ActivityTab profile={profile} user={user} />
                </TabsContent>
                
                <TabsContent value="wall">
                  <WallTab profile={profile} user={user} isEditing={false} />
                </TabsContent>
                
                <TabsContent value="badges">
                  <BadgesDisplay userId={profile?.id} isOwnProfile={false} />
                </TabsContent>
              </Tabs>
            </GlassPanel>
          </div>
        </>
      )}
      
      <BottomNavigation />
    </motion.div>
  );
};

export default UserProfilePage;
