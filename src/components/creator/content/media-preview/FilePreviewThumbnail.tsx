
import React from 'react';
import { Video, Image, FileText } from 'lucide-react';

interface FilePreviewThumbnailProps {
  fileType: string;
  preview?: string;
  media_url?: string;
}

const FilePreviewThumbnail = ({ fileType, preview, media_url }: FilePreviewThumbnailProps) => {
  const isImage = fileType.startsWith('image/');
  const isVideo = fileType.startsWith('video/');
  
  // Use the uploaded media URL if available, otherwise fall back to the local preview
  const previewSrc = media_url || preview;
  
  if (isImage && previewSrc) {
    return (
      <div className="relative aspect-video bg-black/40 overflow-hidden">
        <img 
          src={previewSrc} 
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
        {previewSrc && isVideo ? (
          <video 
            src={previewSrc} 
            className="w-full h-full object-cover"
            controls={false}
            muted
            loop
          />
        ) : (
          <Video className="w-12 h-12 text-white/60" />
        )}
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
