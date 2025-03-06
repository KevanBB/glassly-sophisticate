
import React from 'react';
import { Video, Image, FileText } from 'lucide-react';

interface FilePreviewThumbnailProps {
  fileType: string;
  preview?: string;
}

const FilePreviewThumbnail = ({ fileType, preview }: FilePreviewThumbnailProps) => {
  const isImage = fileType.startsWith('image/');
  const isVideo = fileType.startsWith('video/');
  
  if (isImage) {
    return (
      <div className="relative aspect-video bg-black/40 overflow-hidden">
        <img 
          src={preview} 
          alt="Preview"
          className="w-full h-full object-cover" 
        />
        <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-1">
          <div className="flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/70">Image</span>
          </div>
        </div>
      </div>
    );
  } 
  
  if (isVideo) {
    return (
      <div className="relative aspect-video bg-black/50 flex items-center justify-center">
        <Video className="w-12 h-12 text-white/60" />
        <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-2 py-1">
          <div className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/70">Video</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="aspect-video bg-black/50 flex items-center justify-center">
      <FileText className="w-12 h-12 text-white/60" />
    </div>
  );
};

export default FilePreviewThumbnail;
