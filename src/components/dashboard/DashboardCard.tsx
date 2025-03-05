import React from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  children,
  className = '',
  icon,
  action,
  interactive = false,
  onClick
}: DashboardCardProps) => {
  const cardContent = (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="text-white/70">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        {action && (
          <div className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
            {action}
          </div>
        )}
      </div>
      <div className="text-white/80">
        {children}
      </div>
    </div>
  );

  if (interactive) {
    return (
      <motion.div 
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
        }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`w-full overflow-hidden cursor-pointer ${className}`}
      >
        <GlassPanel 
          intensity="medium" 
          borderIntensity="light" 
          hoverEffect={true}
          className="w-full overflow-hidden"
        >
          {cardContent}
        </GlassPanel>
      </motion.div>
    );
  }

  return (
    <GlassPanel 
      intensity="medium" 
      borderIntensity="light" 
      hoverEffect={true}
      className={`w-full overflow-hidden ${className}`}
    >
      {cardContent}
    </GlassPanel>
  );
};

export default DashboardCard;
