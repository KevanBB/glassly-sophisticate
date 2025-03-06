
import React, { useEffect } from 'react';
import { Bell, UserCheck, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useConnections } from '@/hooks/useConnections';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/community/UserAvatar';
import { formatDistanceToNow } from 'date-fns';

const NotificationCard = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead } = useNotifications(user?.id);
  const { respondToConnectionRequest } = useConnections(user?.id);

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  const handleApprove = async (notificationId: string, connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'approved');
    await markAsRead(notificationId);
  };

  const handleDeny = async (notificationId: string, connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'denied');
    await markAsRead(notificationId);
  };

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
              <UserAvatar user={requesterObj} size="sm" showActiveIndicator={false} />
              <div className="flex-1">
                <div className="font-medium">
                  <Link to={`/profile/${requesterId}`} className="hover:underline">
                    {requesterName}
                  </Link> wants to connect with you
                </div>
                {!notification.is_read && (
                  <div className="flex mt-2 space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(notification.id, connectionId)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <UserCheck size={14} className="mr-1.5" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeny(notification.id, connectionId)}
                      className="border-white/20 text-white"
                    >
                      <UserX size={14} className="mr-1.5" />
                      Decline
                    </Button>
                  </div>
                )}
                {notification.is_read && status === 'approved' && (
                  <div className="text-sm text-green-400 mt-1">
                    <UserCheck size={14} className="inline mr-1" />
                    You accepted this request
                  </div>
                )}
                {notification.is_read && status === 'denied' && (
                  <div className="text-sm text-red-400 mt-1">
                    <UserX size={14} className="inline mr-1" />
                    You declined this request
                  </div>
                )}
              </div>
            </div>
          );
        } else if (status === 'approved') {
          return (
            <div className="flex items-start space-x-3">
              <UserAvatar user={requesterObj} size="sm" showActiveIndicator={false} />
              <div className="flex-1">
                <div className="font-medium">
                  You are now connected with <Link to={`/profile/${requesterId}`} className="hover:underline">{requesterName}</Link>
                </div>
                <div className="text-sm text-green-400 mt-1">
                  <UserCheck size={14} className="inline mr-1" />
                  Connection approved
                </div>
              </div>
            </div>
          );
        } else if (status === 'denied') {
          return (
            <div className="flex items-start space-x-3">
              <UserAvatar user={requesterObj} size="sm" showActiveIndicator={false} />
              <div className="flex-1">
                <div className="font-medium">
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
            <p className="text-sm font-medium text-white truncate">
              {notification.title || "New notification"}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {notification.message || JSON.stringify(notification.content)}
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardCard 
      title="Notifications" 
      icon={<Bell size={18} />}
      action={
        <Link to="/notifications" className="text-sm text-white/70 hover:text-white">
          See all {unreadCount > 0 && `(${unreadCount})`}
        </Link>
      }
      badge={unreadCount > 0 ? unreadCount : undefined}
    >
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-white/50 py-4">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-white/50 py-4">No notifications</p>
        ) : (
          notifications.slice(0, 3).map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`flex items-start p-2 rounded-lg ${!notification.is_read ? 'bg-white/5' : ''}`}
            >
              <div className="flex-1 min-w-0">
                {renderNotificationContent(notification)}
                <p className="text-xs text-white/40 mt-1">
                  {formatTime(notification.created_at)}
                </p>
              </div>
              {!notification.is_read && (
                <div className="h-2 w-2 bg-brand rounded-full mt-1 flex-shrink-0"></div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};

export default NotificationCard;
