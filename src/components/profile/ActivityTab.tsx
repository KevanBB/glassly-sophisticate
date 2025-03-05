
import React, { useState, useEffect } from 'react';
import { Activity, Clock, Calendar, Heart, MessageSquare, UserPlus, Image, Video } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityItem {
  id: string;
  type: 'login' | 'post' | 'like' | 'comment' | 'friend' | 'image' | 'video';
  timestamp: string;
  content?: string;
  targetId?: string;
  targetName?: string;
}

interface ActivityTabProps {
  profile: any;
  user: any;
}

const ActivityTab = ({ profile, user }: ActivityTabProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    // Fetch activities - this would normally come from the backend
    setActivities([
      { 
        id: '1', 
        type: 'login', 
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago 
      },
      { 
        id: '2', 
        type: 'post', 
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        content: 'Just updated my profile with new photos!' 
      },
      { 
        id: '3', 
        type: 'like', 
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        targetId: 'post123',
        targetName: 'Alex\'s post'  
      },
      { 
        id: '4', 
        type: 'comment', 
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        content: 'Great photo!',
        targetId: 'post456',
        targetName: 'Taylor\'s photo'
      },
      { 
        id: '5', 
        type: 'friend', 
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        targetId: 'user789',
        targetName: 'Jordan Smith'
      },
      { 
        id: '6', 
        type: 'image', 
        timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        content: 'Uploaded a new profile picture'
      },
      { 
        id: '7', 
        type: 'video', 
        timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        content: 'Posted a new video'
      }
    ]);
  }, []);
  
  const getFilteredActivities = () => {
    if (filter === 'all') return activities;
    return activities.filter(activity => activity.type === filter);
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInHours < 48) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Clock size={18} className="text-primary" />;
      case 'post':
        return <MessageSquare size={18} className="text-green-400" />;
      case 'like':
        return <Heart size={18} className="text-red-400" />;
      case 'comment':
        return <MessageSquare size={18} className="text-blue-400" />;
      case 'friend':
        return <UserPlus size={18} className="text-purple-400" />;
      case 'image':
        return <Image size={18} className="text-amber-400" />;
      case 'video':
        return <Video size={18} className="text-pink-400" />;
      default:
        return <Activity size={18} className="text-primary" />;
    }
  };
  
  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'login':
        return 'Logged in';
      case 'post':
        return `Posted: "${activity.content}"`;
      case 'like':
        return `Liked ${activity.targetName}`;
      case 'comment':
        return `Commented on ${activity.targetName}: "${activity.content}"`;
      case 'friend':
        return `Connected with ${activity.targetName}`;
      case 'image':
        return activity.content || 'Uploaded an image';
      case 'video':
        return activity.content || 'Uploaded a video';
      default:
        return 'Unknown activity';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Activity Log</h2>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Filter activities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="login">Logins</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="like">Likes</SelectItem>
            <SelectItem value="comment">Comments</SelectItem>
            <SelectItem value="friend">Connections</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <GlassPanel className="p-6">
        <div className="space-y-4">
          {getFilteredActivities().length > 0 ? (
            getFilteredActivities().map(activity => (
              <div key={activity.id} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="bg-white/10 p-2 rounded-full mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">{getActivityDescription(activity)}</p>
                      <span className="text-white/60 text-sm">{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity size={36} className="text-white/20 mx-auto mb-2" />
              <p className="text-white/60">No activity found</p>
            </div>
          )}
        </div>
      </GlassPanel>
      
      <div className="text-center">
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/5"
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default ActivityTab;
