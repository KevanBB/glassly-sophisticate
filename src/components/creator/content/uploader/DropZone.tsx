import React, { useRef, useState } from 'react';
import { Upload, Image, FileVideo } from 'lucide-react';
import { toast } from 'sonner';
import { FileWithMetadata } from '../utils/uploaderUtils';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isSubmitting: boolean;
  fileCount: number;
}

const DropZone = ({ onFilesSelected, isSubmitting, fileCount }: DropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.target.files) return;
    
    onFilesSelected(Array.from(e.target.files));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-md p-8 text-center transition-all duration-200 ${
        isDragging 
          ? 'border-primary/70 bg-primary/10' 
          : 'border-white/10 bg-background/30 hover:border-white/20'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-white/60 py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary/70" />
        </div>
        <p className="text-lg">Drag and drop files here</p>
        <p className="text-sm">Or click Add Media to upload</p>
        <div className="flex gap-3 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <Image className="w-4 h-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-1">
            <FileVideo className="w-4 h-4" />
            <span>Videos</span>
          </div>
        </div>
        <p className="text-xs mt-4 text-white/40">
          Up to 10 files, maximum 500MB total
        </p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
        accept="image/*,video/*"
        disabled={fileCount >= 10 || isSubmitting}
      />
    </div>
  );
};

export default DropZone;
