import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Mail, UserPlus, Calendar, UserCheck, UserMinus, UserX, Loader2 } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useConnections } from '@/hooks/useConnections';

interface ProfileHeaderProps {
  profile: any;
  user: any;
  isEditing?: boolean;
  isOwnProfile?: boolean;
  onToggleEdit?: () => void;
}

const ProfileHeader = ({ profile, user, isEditing = false, isOwnProfile = true, onToggleEdit }: ProfileHeaderProps) => {
  const { user: currentUser } = useAuth();
  const { sendConnectionRequest, getConnectionStatus, removeConnection } = useConnections(currentUser?.id);
  const [connectionStatus, setConnectionStatus] = useState<{
    id?: string;
    status?: 'pending' | 'approved' | 'denied';
    requester_id?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatJoinDate = (timestamp: string) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  useEffect(() => {
    const loadConnectionStatus = async () => {
      if (!currentUser || !profile || isOwnProfile) return;
      
      try {
        const connection = await getConnectionStatus(profile.id);
        if (connection) {
          setConnectionStatus({
            id: connection.id,
            status: connection.status as 'pending' | 'approved' | 'denied',
            requester_id: connection.requester_id
          });
        }
      } catch (error) {
        console.error('Error loading connection status:', error);
      }
    };
    
    loadConnectionStatus();
  }, [currentUser, profile, isOwnProfile, getConnectionStatus]);
  
  const handleConnect = async () => {
    if (!currentUser || !profile) return;
    
    setIsLoading(true);
    try {
      const result = await sendConnectionRequest(profile.id);
      if (result.success && result.data) {
        setConnectionStatus({
          id: result.data.id,
          status: 'pending',
          requester_id: currentUser.id
        });
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveConnection = async () => {
    if (!connectionStatus?.id) return;
    
    setIsLoading(true);
    try {
      const result = await removeConnection(connectionStatus.id);
      if (result.success) {
        setConnectionStatus(null);
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMessage = () => {
    toast.success("Message started");
    // Add logic to navigate to messages page with this user
  };

  const renderConnectionButton = () => {
    if (isOwnProfile || !currentUser) return null;
    
    if (isLoading) {
      return (
        <Button size="sm" className="bg-brand hover:bg-brand/90 text-white" disabled>
          <Loader2 size={16} className="mr-1.5 animate-spin" />
          Loading...
        </Button>
      );
    }
    
    if (!connectionStatus) {
      return (
        <Button 
          size="sm" 
          className="bg-brand hover:bg-brand/90 text-white"
          onClick={handleConnect}
        >
          <UserPlus size={16} className="mr-1.5" />
          Connect
        </Button>
      );
    }
    
    if (connectionStatus.status === 'pending') {
      if (connectionStatus.requester_id === currentUser.id) {
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="border-white/20 text-white"
            disabled
          >
            <Loader2 size={16} className="mr-1.5" />
            Request Pending
          </Button>
        );
      } else {
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="border-white/20 text-white"
            disabled
          >
            <Loader2 size={16} className="mr-1.5" />
            Pending Approval
          </Button>
        );
      }
    }
    
    if (connectionStatus.status === 'approved') {
      return (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-white/20 text-white"
          onClick={handleRemoveConnection}
        >
          <UserCheck size={16} className="mr-1.5" />
          Connected
        </Button>
      );
    }
    
    return (
      <Button 
        size="sm" 
        className="bg-brand hover:bg-brand/90 text-white"
        onClick={handleConnect}
      >
        <UserPlus size={16} className="mr-1.5" />
        Connect
      </Button>
    );
  };

  return (
    <div className="relative w-full max-w-4xl z-10 mb-6">
      <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary/30 to-purple-500/30 relative">
        {profile?.banner_url ? (
          <img
            src={profile.banner_url}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30" />
        )}
        
        {isOwnProfile && (
          <div className="absolute bottom-3 right-3">
            {isEditing ? (
              <Button 
                size="sm" 
                variant="secondary" 
                className="opacity-80 hover:opacity-100 bg-black/50"
              >
                Change Banner
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={onToggleEdit}
                className="opacity-80 hover:opacity-100 bg-black/50"
              >
                <Edit2 size={16} className="mr-1" />
                Edit Profile
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row px-4 pt-0 pb-4 relative">
        <div className="absolute -top-16 left-4 sm:left-8">
          <ProfileAvatar 
            avatarUrl={profile?.avatar_url}
            editing={isEditing && isOwnProfile} 
            userId={profile?.id}
            size="lg"
          />
        </div>
        
        <div className="mt-16 sm:mt-4 sm:ml-32 md:ml-36 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white truncate">
                {profile?.display_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`}
              </h1>
              
              <div className="flex items-center text-white/60 mt-1">
                <Calendar size={14} className="mr-1.5" />
                <span className="text-sm">
                  Joined {formatJoinDate(profile?.joined_at || profile?.updated_at)}
                </span>
              </div>
            </div>
            
            {!isOwnProfile && user && (
              <div className="flex gap-2">
                {renderConnectionButton()}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/20 text-white"
                  onClick={handleMessage}
                >
                  <Mail size={16} className="mr-1.5" />
                  Message
                </Button>
              </div>
            )}
            
            {isOwnProfile && !isEditing && (
              <div className="sm:hidden">
                <Button onClick={onToggleEdit} className="w-full">
                  <Edit2 size={16} className="mr-1.5" />
                  Edit Profile
                </Button>
              </div>
            )}
            
            {isEditing && (
              <div>
                <Button onClick={onToggleEdit} variant="outline" className="border-white/20 text-white">
                  Cancel Editing
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
