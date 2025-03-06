
import React from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, Users, Settings } from 'lucide-react';

const ContentQuickActions = () => {
  return (
    <GlassPanel className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <FileText className="h-6 w-6 mb-2" />
          <span>New Post</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <BarChart className="h-6 w-6 mb-2" />
          <span>Analytics</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <Users className="h-6 w-6 mb-2" />
          <span>Subscribers</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
          <Settings className="h-6 w-6 mb-2" />
          <span>Settings</span>
        </Button>
      </div>
    </GlassPanel>
  );
};

export default ContentQuickActions;
