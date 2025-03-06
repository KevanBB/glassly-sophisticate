
import React from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface DashboardHeaderProps {
  username?: string;
}

const DashboardHeader = ({ username }: DashboardHeaderProps) => {
  return (
    <GlassPanel className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
          {username && (
            <p className="text-white/70">
              @{username}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </GlassPanel>
  );
};

export default DashboardHeader;
