
import React, { ReactNode } from 'react';

export interface DashboardCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  badge?: number; // Added badge property to fix the TypeScript error
}

const DashboardCard = ({ title, children, icon, action, badge }: DashboardCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-white/80">{icon}</span>}
          <h3 className="text-lg font-semibold text-white">
            {title}
            {badge !== undefined && badge > 0 && (
              <span className="ml-2 text-xs bg-brand text-white px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </h3>
        </div>
        {action && <div className="text-sm">{action}</div>}
      </div>
      {children}
    </div>
  );
};

export default DashboardCard;
