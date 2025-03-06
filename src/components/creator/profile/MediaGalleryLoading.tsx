
import React from 'react';
import { Loader2 } from 'lucide-react';
import ViewSwitcher from './ViewSwitcher';
import { ViewType } from './types';

interface MediaGalleryLoadingProps {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
}

const MediaGalleryLoading = ({ viewType, onViewChange }: MediaGalleryLoadingProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ViewSwitcher viewType={viewType} onViewChange={onViewChange} />
      
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </div>
  );
};

export default MediaGalleryLoading;
