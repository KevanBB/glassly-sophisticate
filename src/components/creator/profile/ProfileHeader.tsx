
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Edit, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const isOwnProfile = true; // TODO: Implement check

  return (
    <div className="relative w-full">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={profile.banner_url || '/placeholder.svg'}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4"
          >
            <Edit className="w-4 h-4 mr-2" />
            Change Banner
          </Button>
        )}
      </div>

      {/* Profile Info Card */}
      <Card className="max-w-4xl mx-auto -mt-24 relative z-10 bg-card/80 backdrop-blur-xl border-white/10">
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar_url || '/placeholder.svg'}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full border-4 border-background object-cover"
              />
              {isOwnProfile && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-0 right-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {profile.creator_username}
                  </h1>
                  <p className="text-lg text-white/60 mt-1">
                    {profile.display_name}
                  </p>
                </div>
                {isOwnProfile ? (
                  <Button variant="outline">Edit Profile</Button>
                ) : (
                  <Button>
                    <Heart className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                )}
              </div>

              {/* Bio */}
              <p className="mt-4 text-white/80 max-w-2xl">
                {profile.bio || "This creator hasn't written a bio yet."}
              </p>

              {/* Quick Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-white/60">
                  <span className="text-white font-bold">2.1K</span> followers
                </div>
                <div className="text-white/60">
                  <span className="text-white font-bold">142</span> posts
                </div>
              </div>

              {/* Categories/Kinks/Fetishes */}
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.kinks_fetishes?.map((kink) => (
                  <span
                    key={kink}
                    className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-sm"
                  >
                    {kink}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;
