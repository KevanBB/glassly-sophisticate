import React, { useRef } from 'react';
import { FileWithMetadata } from './utils/uploaderUtils';
import { useMediaFiles } from './uploader/useMediaFiles';
import MediaUploaderHeader from './uploader/MediaUploaderHeader';
import DropZone from './uploader/DropZone';
import MediaFilesList from './uploader/MediaFilesList';

interface NewMediaUploaderProps {
  mediaFiles: FileWithMetadata[];
  isSubmitting: boolean;
  onChange: (files: FileWithMetadata[]) => void;
  uploadProgress: { [key: string]: number };
}

const NewMediaUploader = ({ 
  mediaFiles, 
  isSubmitting, 
  onChange,
  uploadProgress
}: NewMediaUploaderProps) => {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    addFiles,
    removeFile,
    moveFile,
    updateCaption,
    clearAllFiles
  } = useMediaFiles(mediaFiles, onChange);

  const handleAddMediaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFilesSelected = (files: File[]) => {
    addFiles(files);
  };

  return (
    <div className="space-y-4">
      <MediaUploaderHeader 
        onAddMediaClick={handleAddMediaClick} 
        isDisabled={mediaFiles.length >= 10 || isSubmitting}
      />
      
      {mediaFiles.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          isSubmitting={isSubmitting}
          fileCount={mediaFiles.length}
        />
      ) : (
        <MediaFilesList
          mediaFiles={mediaFiles}
          onRemove={removeFile}
          onMove={moveFile}
          onCaptionChange={updateCaption}
          onClearAll={clearAllFiles}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
        />
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (!e.target.files) return;
          
          handleFilesSelected(Array.from(e.target.files));
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        className="hidden"
        multiple
        accept="image/*,video/*"
        disabled={mediaFiles.length >= 10 || isSubmitting}
      />
    </div>
  );
};

export default NewMediaUploader;
