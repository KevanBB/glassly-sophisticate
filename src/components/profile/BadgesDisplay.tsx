
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Target, Heart, Zap, Crown, Medal } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  date_earned?: string;
  level?: number;
  color?: string;
}

interface BadgesDisplayProps {
  userId: string;
  isOwnProfile?: boolean;
}

const BadgesDisplay = ({ userId, isOwnProfile = false }: BadgesDisplayProps) => {
  // This would normally be fetched from the database
  const badges: BadgeItem[] = [
    {
      id: "1",
      name: "Community Builder",
      description: "Connected with 10+ members of the community",
      icon: <Star className="h-5 w-5 text-amber-400" />,
      earned: true,
      date_earned: "2023-08-15",
      level: 2,
      color: "bg-amber-500/20 text-amber-200 border-amber-500/30"
    },
    {
      id: "2",
      name: "Profile Perfectionist",
      description: "Completed all profile sections",
      icon: <Award className="h-5 w-5 text-violet-400" />,
      earned: true,
      date_earned: "2023-07-22",
      color: "bg-violet-500/20 text-violet-200 border-violet-500/30"
    },
    {
      id: "3",
      name: "Engagement Star",
      description: "Highly active in community discussions",
      icon: <Crown className="h-5 w-5 text-orange-400" />,
      earned: false,
      color: "bg-gray-700 text-gray-400 border-gray-600"
    },
    {
      id: "4",
      name: "Content Creator",
      description: "Posted 25+ times on your wall",
      icon: <Zap className="h-5 w-5 text-blue-400" />,
      earned: true,
      date_earned: "2023-09-10",
      level: 1,
      color: "bg-blue-500/20 text-blue-200 border-blue-500/30"
    },
    {
      id: "5",
      name: "Connection Master",
      description: "Connected with 50+ members",
      icon: <Heart className="h-5 w-5 text-red-400" />,
      earned: false,
      color: "bg-gray-700 text-gray-400 border-gray-600"
    },
    {
      id: "6",
      name: "Verified Veteran",
      description: "Active member for over 1 year",
      icon: <Medal className="h-5 w-5 text-emerald-400" />,
      earned: false,
      color: "bg-gray-700 text-gray-400 border-gray-600"
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);
  
  return (
    <GlassPanel className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Badges & Achievements</h3>
        {isOwnProfile && (
          <Badge variant="outline" className="border-primary/30 text-white/80">
            {earnedBadges.length}/{badges.length} Earned
          </Badge>
        )}
      </div>
      <Separator className="bg-white/10" />
      
      <div className="space-y-6">
        {earnedBadges.length > 0 && (
          <div>
            <h4 className="text-white/80 text-sm font-medium mb-3">Earned Badges</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {earnedBadges.map(badge => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className={`group flex items-center p-2 rounded-md ${badge.color} cursor-pointer transition-all hover:scale-105`}>
                      <div className="mr-2 p-1.5 rounded-full bg-black/20">
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{badge.name}</p>
                        {badge.level && (
                          <p className="text-xs opacity-80">Level {badge.level}</p>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="max-w-xs">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-sm opacity-90">{badge.description}</p>
                      {badge.date_earned && (
                        <p className="text-xs mt-1 opacity-80">
                          Earned on {new Date(badge.date_earned).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
        
        {isOwnProfile && lockedBadges.length > 0 && (
          <div>
            <h4 className="text-white/80 text-sm font-medium mb-3">Badges to Unlock</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {lockedBadges.map(badge => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className={`group flex items-center p-2 rounded-md ${badge.color} cursor-pointer`}>
                      <div className="mr-2 p-1.5 rounded-full bg-black/20">
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{badge.name}</p>
                        <p className="text-xs opacity-80">Locked</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="max-w-xs">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-sm opacity-90">{badge.description}</p>
                      <p className="text-xs mt-1 opacity-80">
                        How to earn: {badge.description}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
        
        {!isOwnProfile && lockedBadges.length > 0 && earnedBadges.length === 0 && (
          <div className="text-center py-4">
            <Trophy className="h-10 w-10 mx-auto text-gray-500 mb-2" />
            <p className="text-white/60">This user hasn't earned any badges yet</p>
          </div>
        )}
      </div>
    </GlassPanel>
  );
};

export default BadgesDisplay;
