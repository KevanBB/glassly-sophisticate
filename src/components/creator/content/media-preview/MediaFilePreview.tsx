
import React from 'react';
import { FileWithMetadata } from '../utils/uploaderUtils';
import FilePreviewThumbnail from './FilePreviewThumbnail';
import CaptionEditor from './CaptionEditor';
import ProgressBar from './ProgressBar';
import FileActions from './FileActions';
import FileInfo from './FileInfo';
import FileStatusIndicator from './FileStatusIndicator';

interface MediaFilePreviewProps {
  file: FileWithMetadata;
  index: number;
  totalFiles: number;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onCaptionChange: (index: number, caption: string) => void;
  progress: number;
}

const MediaFilePreview = ({ 
  file, 
  index, 
  totalFiles,
  onRemove, 
  onMove, 
  onCaptionChange,
  progress
}: MediaFilePreviewProps) => {
  // Add safety checks for file type
  const fileType = file?.type || '';
  
  const handleCaptionChange = (caption: string) => {
    onCaptionChange(index, caption);
  };

  return (
    <div className="border border-white/10 rounded-md overflow-hidden bg-background/50 transition-all duration-200 hover:border-white/20 group">
      <div className="relative">
        <FilePreviewThumbnail fileType={fileType} preview={file.preview} />
        
        <FileActions 
          index={index} 
          totalFiles={totalFiles} 
          onRemove={onRemove} 
          onMove={onMove} 
        />
        
        <FileStatusIndicator status={file.status} />
      </div>
      
      <div className="p-3">
        <FileInfo 
          fileName={file.name} 
          status={file.status}
          error={file.error}
        />
        
        <div className="relative">
          <CaptionEditor 
            caption={file.caption} 
            onCaptionChange={handleCaptionChange} 
          />
        </div>
        
        <ProgressBar progress={progress} status={file.status} />
      </div>
    </div>
  );
};

export default MediaFilePreview;
