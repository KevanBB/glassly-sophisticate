
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Bell, UserCheck, UserX, Check } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/hooks/useNotifications';
import { useConnections } from '@/hooks/useConnections';
import UserAvatar from '@/components/community/UserAvatar';
import { Link } from 'react-router-dom';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import { toast } from 'sonner';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { notifications, loading, markAllAsRead } = useNotifications(user?.id);
  const { respondToConnectionRequest } = useConnections(user?.id);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      toast.success('All notifications marked as read');
    } else {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleApprove = async (notificationId: string, connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'approved');
  };

  const handleDeny = async (notificationId: string, connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'denied');
  };

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return !notification.is_read;
  });

  const renderNotificationContent = (notification: any) => {
    switch (notification.type) {
      case 'connection_request':
        const connectionId = notification.content?.connection_id;
        const requesterId = notification.content?.requester_id;
        const status = notification.content?.status;
        const requesterName = notification.sender_info?.display_name || 
                             `${notification.sender_info?.first_name || ''} ${notification.sender_info?.last_name || ''}`.trim() || 
                             'Someone';

        // Create user object for UserAvatar
        const requesterObj = {
          id: requesterId,
          avatar_url: notification.sender_info?.avatar_url,
          display_name: notification.sender_info?.display_name,
          first_name: notification.sender_info?.first_name,
          last_name: notification.sender_info?.last_name
        };

        if (status === 'pending') {
          return (
            <div className="flex items-start space-x-3">
              <UserAvatar user={requesterObj} size="md" showActiveIndicator={false} />
              <div className="flex-1">
                <div className="font-medium text-lg">
                  <Link to={`/profile/${requesterId}`} className="hover:underline">
                    {requesterName}
                  </Link> wants to connect with you
                </div>
                {!notification.is_read && (
                  <div className="flex mt-3 space-x-3">
                    <Button 
                      onClick={() => handleApprove(notification.id, connectionId)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <UserCheck size={16} className="mr-2" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDeny(notification.id, connectionId)}
                      className="border-white/20 text-white"
                    >
                      <UserX size={16} className="mr-2" />
                      Decline
                    </Button>
                  </div>
                )}
                {notification.is_read && status === 'approved' && (
                  <div className="text-green-400 mt-2">
                    <UserCheck size={16} className="inline mr-2" />
                    You accepted this request
                  </div>
                )}
                {notification.is_read && status === 'denied' && (
                  <div className="text-red-400 mt-2">
                    <UserX size={16} className="inline mr-2" />
                    You declined this request
                  </div>
                )}
              </div>
            </div>
          );
        } else if (status === 'approved') {
          return (
            <div className="flex items-start space-x-3">
              <UserAvatar user={requesterObj} size="md" showActiveIndicator={false} />
              <div className="flex-1">
                <div className="font-medium text-lg">
                  You are now connected with <Link to={`/profile/${requesterId}`} className="hover:underline">{requesterName}</Link>
                </div>
                <div className="text-green-400 mt-2">
                  <UserCheck size={16} className="inline mr-2" />
                  Connection approved
                </div>
              </div>
            </div>
          );
        } else if (status === 'denied') {
          return (
            <div className="flex items-start space-x-3">
              <UserAvatar user={requesterObj} size="md" showActiveIndicator={false} />
              <div className="flex-1">
                <div className="font-medium text-lg">
                  Connection request from <Link to={`/profile/${requesterId}`} className="hover:underline">{requesterName}</Link> declined
                </div>
              </div>
            </div>
          );
        }
        return null;
        
      default:
        return (
          <div>
            <p className="text-lg font-medium text-white">
              {notification.title || "New notification"}
            </p>
            <p className="text-white/60 mt-2">
              {notification.message || JSON.stringify(notification.content)}
            </p>
          </div>
        );
    }
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
      
      <div className="w-full max-w-4xl z-10 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bell size={24} className="mr-3 text-white" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white/10 rounded-lg p-1">
              <Button
                variant={filter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-white/20' : ''}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-white/20' : ''}
              >
                Unread
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="border-white/20 text-white"
            >
              <Check size={16} className="mr-1.5" />
              Mark all as read
            </Button>
          </div>
        </div>
        
        <GlassPanel className="p-6 mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell size={40} className="mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No notifications</h3>
              <p className="text-white/60">
                {filter === 'unread' 
                  ? "You've read all your notifications." 
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`p-4 rounded-lg ${!notification.is_read ? 'bg-white/5' : 'border border-white/10'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      {renderNotificationContent(notification)}
                    </div>
                    {!notification.is_read && (
                      <div className="h-3 w-3 bg-brand rounded-full mt-1"></div>
                    )}
                  </div>
                  <div className="text-sm text-white/40 mt-3">
                    {formatTime(notification.created_at)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
      
      <BottomNavigation />
    </motion.div>
  );
};

export default NotificationsPage;
