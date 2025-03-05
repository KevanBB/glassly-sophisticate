
import React from 'react';
import { Zap, Search, MessageCircle, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

interface QuickAction {
  id: number;
  title: string;
  icon: string;
  color: string;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
}

const QuickActionsCard = ({ actions }: QuickActionsCardProps) => {
  // Map icon strings to components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search size={20} />;
      case 'MessageCircle':
        return <MessageCircle size={20} />;
      case 'User':
        return <User size={20} />;
      case 'Settings':
        return <Settings size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  return (
    <DashboardCard 
      title="Quick Actions" 
      icon={<Zap size={18} />}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className={`${action.color} w-10 h-10 rounded-full flex items-center justify-center mb-2`}>
              {getIcon(action.icon)}
            </div>
            <p className="text-sm font-medium text-white">
              {action.title}
            </p>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default QuickActionsCard;
