
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, MoveUp, MoveDown, Video, Image, 
  Loader2, Pencil, Check, FileText
} from 'lucide-react';
import { FileWithMetadata } from './utils/uploaderUtils';

interface NewMediaFilePreviewProps {
  file: FileWithMetadata;
  index: number;
  totalFiles: number;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onCaptionChange: (index: number, caption: string) => void;
  progress: number;
}

const NewMediaFilePreview = ({ 
  file, 
  index, 
  totalFiles,
  onRemove, 
  onMove, 
  onCaptionChange,
  progress
}: NewMediaFilePreviewProps) => {
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState(file.caption || '');
  
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

  const saveCaption = () => {
    onCaptionChange(index, captionText);
    setIsEditingCaption(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveCaption();
    }
  };

  return (
    <div className="border border-white/10 rounded-md overflow-hidden bg-background/50 transition-all duration-200 hover:border-white/20 group">
      <div className="relative">
        {file.type.startsWith('image/') ? (
          <div className="relative aspect-video bg-black/40 overflow-hidden">
            <img 
              src={file.preview} 
              alt={`Preview ${index}`}
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-1">
              <div className="flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-white/70" />
                <span className="text-xs text-white/70">Image</span>
              </div>
            </div>
          </div>
        ) : file.type.startsWith('video/') ? (
          <div className="relative aspect-video bg-black/50 flex items-center justify-center">
            <Video className="w-12 h-12 text-white/60" />
            <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-1">
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-white/70" />
                <span className="text-xs text-white/70">Video</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-black/50 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white/60" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-8 w-8 bg-black/70 border border-white/10 backdrop-blur-sm hover:bg-red-600"
            onClick={() => onRemove(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Status indicator overlay */}
        {file.status && file.status !== 'complete' && file.status !== 'pending' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
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
        
        <div className="relative">
          {isEditingCaption ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add caption..."
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm bg-background/30 border-white/10"
                autoFocus
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 flex-shrink-0"
                onClick={saveCaption}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 py-1.5 px-3 bg-background/20 rounded border border-white/5 cursor-text"
              onClick={() => setIsEditingCaption(true)}
            >
              <span className="text-sm text-white/60 truncate">
                {file.caption || 'Add caption...'}
              </span>
              <Pencil className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
            </div>
          )}
        </div>
        
        {/* Status bar */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs text-white/70">
            <span>{getStatusText(file.status)}</span>
            {progress > 0 && progress < 100 && <span>{progress}%</span>}
          </div>
          <div className="w-full bg-background/30 rounded-full h-1.5">
            <div 
              className={`${getStatusColor(file.status)} h-1.5 rounded-full transition-all duration-200`} 
              style={{ width: `${progress || 0}%` }}
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

export default NewMediaFilePreview;
