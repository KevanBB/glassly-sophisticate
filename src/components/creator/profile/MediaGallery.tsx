
import React from 'react';
import { motion } from 'framer-motion';
import { ViewType } from './types';
import { Button } from '@/components/ui/button';
import { Grid2X2, List } from 'lucide-react';

interface MediaGalleryProps {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
}

const MediaGallery = ({ viewType, onViewChange }: MediaGalleryProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* View Toggle */}
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

      {/* Content */}
      <motion.div
        layout
        className={`gap-6 ${
          viewType === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-6'
        }`}
      >
        {/* Placeholder content - Replace with actual content */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            layout
            className="bg-card rounded-lg overflow-hidden"
          >
            <div className="aspect-video bg-muted" />
            <div className="p-4">
              <p className="text-white/60">Sample post {i}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MediaGallery;
