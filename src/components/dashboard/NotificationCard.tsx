
import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationCardProps {
  notifications: Notification[];
}

const NotificationCard = ({ notifications }: NotificationCardProps) => {
  return (
    <DashboardCard 
      title="Notifications" 
      icon={<Bell size={18} />}
      action={<span>See all</span>}
    >
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-center text-white/50 py-4">No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`flex items-start p-2 rounded-lg ${!notification.read ? 'bg-white/5' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {notification.title}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {notification.time}
                </p>
              </div>
              {!notification.read && (
                <div className="h-2 w-2 bg-brand rounded-full mt-1"></div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};

export default NotificationCard;
