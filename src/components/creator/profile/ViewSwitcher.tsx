
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid2X2, List } from 'lucide-react';
import { ViewType } from './types';

interface ViewSwitcherProps {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
}

const ViewSwitcher = ({ viewType, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="bg-card rounded-lg p-1 flex gap-1">
        <Button
          variant={viewType === 'timeline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('timeline')}
        >
          <List className="w-4 h-4 mr-2" />
          Timeline
        </Button>
        <Button
          variant={viewType === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('grid')}
        >
          <Grid2X2 className="w-4 h-4 mr-2" />
          Grid
        </Button>
      </div>
    </div>
  );
};

export default ViewSwitcher;
