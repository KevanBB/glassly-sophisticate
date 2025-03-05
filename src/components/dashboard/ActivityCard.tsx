
import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface ActivityCardProps {
  activities: ActivityItem[];
}

const ActivityCard = ({ activities }: ActivityCardProps) => {
  return (
    <DashboardCard 
      title="Activity" 
      icon={<Activity size={18} />}
      action={<span>History</span>}
    >
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-center text-white/50 py-4">No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start p-2 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80">
                  {activity.message}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};

export default ActivityCard;
