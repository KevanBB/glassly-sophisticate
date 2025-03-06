
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '@/components/creator/profile/ProfileHeader';
import MediaGallery from '@/components/creator/profile/MediaGallery';
import { ViewType } from '@/components/creator/profile/types';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';

const CreatorProfile = () => {
  const { username } = useParams();
  const [viewType, setViewType] = useState<ViewType>('timeline');
  const { profile, loading, error } = useCreatorProfile(username);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">{error || "Creator not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} />
      <MediaGallery viewType={viewType} onViewChange={setViewType} />
    </div>
  );
};

export default CreatorProfile;
