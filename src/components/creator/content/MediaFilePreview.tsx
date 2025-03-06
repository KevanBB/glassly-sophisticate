
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, MoveUp, MoveDown, Video, FileText, Loader2
} from 'lucide-react';
import { FileWithMetadata } from './utils/uploaderUtils';

interface MediaFilePreviewProps {
  file: FileWithMetadata;
  index: number;
  totalFiles: number;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onCaptionChange: (index: number, caption: string) => void;
}

const MediaFilePreview = ({ 
  file, 
  index, 
  totalFiles,
  onRemove, 
  onMove, 
  onCaptionChange 
}: MediaFilePreviewProps) => {
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'pending': return 'Ready to upload';
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'complete': return 'Uploaded';
      case 'error': return 'Upload failed';
      default: return 'Pending';
    }
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-400';
      case 'uploading': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="border border-white/10 rounded-md overflow-hidden bg-background/50">
      <div className="relative">
        {file.type.startsWith('image/') ? (
          <img 
            src={file.preview} 
            alt={`Preview ${index}`}
            className="w-full aspect-video object-cover" 
          />
        ) : file.type.startsWith('video/') ? (
          <div className="w-full aspect-video bg-black/50 flex items-center justify-center">
            <Video className="w-12 h-12 text-white/60" />
          </div>
        ) : (
          <div className="w-full aspect-video bg-black/50 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white/60" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            onClick={() => onRemove(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Status indicator overlay */}
        {file.status && file.status !== 'complete' && file.status !== 'pending' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
              <span className="text-white text-sm">{getStatusText(file.status)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 truncate max-w-[70%]">
            {file.status === 'complete' && (
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            )}
            <span className="text-sm text-white/70 truncate">
              {file.name}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => onMove(index, 'up')}
              disabled={index === 0}
            >
              <MoveUp className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => onMove(index, 'down')}
              disabled={index === totalFiles - 1}
            >
              <MoveDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add caption..."
            value={file.caption || ''}
            onChange={(e) => onCaptionChange(index, e.target.value)}
            className="text-sm bg-background/30 border-white/10"
          />
        </div>
        
        {/* Status bar */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs text-white/70">
            <span>{getStatusText(file.status)}</span>
            {file.progress !== undefined && <span>{file.progress}%</span>}
          </div>
          <div className="w-full bg-background/30 rounded-full h-1.5">
            <div 
              className={`${getStatusColor(file.status)} h-1.5 rounded-full transition-all duration-200`} 
              style={{ width: `${file.progress || 0}%` }}
            ></div>
          </div>
          {file.error && (
            <p className="text-xs text-red-400 mt-1">{file.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaFilePreview;
