import React from 'react';
import { X, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileWithMetadata } from '../utils/uploaderUtils';
import MediaFilePreview from '../media-preview/MediaFilePreview';

interface MediaFilesListProps {
  mediaFiles: FileWithMetadata[];
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onCaptionChange: (index: number, caption: string) => void;
  onClearAll: () => void;
  isSubmitting: boolean;
  uploadProgress: { [key: string]: number };
}

const MediaFilesList = ({ 
  mediaFiles, 
  onRemove, 
  onMove, 
  onCaptionChange, 
  onClearAll,
  isSubmitting,
  uploadProgress 
}: MediaFilesListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Grip className="w-4 h-4 text-white/40" />
          <span className="text-sm text-white/60">
            {mediaFiles.length} {mediaFiles.length === 1 ? 'file' : 'files'} selected
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-white/60 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClearAll();
            }}
            disabled={isSubmitting}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear all
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaFiles.map((file, index) => (
          <MediaFilePreview
            key={index}
            file={file}
            index={index}
            totalFiles={mediaFiles.length}
            onRemove={onRemove}
            onMove={onMove}
            onCaptionChange={onCaptionChange}
            progress={uploadProgress[file.name] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaFilesList;
