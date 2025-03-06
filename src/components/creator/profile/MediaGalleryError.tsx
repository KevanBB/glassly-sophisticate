
import React from 'react';
import ViewSwitcher from './ViewSwitcher';
import { ViewType } from './types';

interface MediaGalleryErrorProps {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
  error: string;
}

const MediaGalleryError = ({ viewType, onViewChange, error }: MediaGalleryErrorProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ViewSwitcher viewType={viewType} onViewChange={onViewChange} />
      
      <div className="flex items-center justify-center py-12 text-white/60">
        {error}
      </div>
    </div>
  );
};

export default MediaGalleryError;
