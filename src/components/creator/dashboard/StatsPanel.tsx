
import React from 'react';
import GlassPanel from '@/components/ui/GlassPanel';

const StatsPanel = () => {
  // Mock stats for now
  const stats = {
    subscribers: 0,
    revenue: 0,
    views: 0
  };

  return (
    <GlassPanel className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Subscribers</span>
          <span className="text-white font-medium">{stats.subscribers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Revenue</span>
          <span className="text-white font-medium">${stats.revenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Content Views</span>
          <span className="text-white font-medium">{stats.views}</span>
        </div>
      </div>
    </GlassPanel>
  );
};

export default StatsPanel;
