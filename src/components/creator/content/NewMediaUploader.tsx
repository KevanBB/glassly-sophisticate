import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Image, 
  FileVideo, 
  Upload, 
  X, 
  PlusCircle, 
  LayoutGrid, 
  Grip,
  Pencil
} from 'lucide-react';
import { toast } from 'sonner';
import { FileWithMetadata } from './utils/uploaderUtils';
import NewMediaFilePreview from './NewMediaFilePreview';

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
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent default behavior to avoid form submission
    e.preventDefault();
    e.stopPropagation();
    
    console.log("File selected, preventing form submission");
    
    if (!e.target.files) return;
    
    addNewFiles(Array.from(e.target.files));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const addNewFiles = useCallback((selectedFiles: File[]) => {
    const totalFilesAfterAddition = mediaFiles.length + selectedFiles.length;
    
    if (totalFilesAfterAddition > 10) {
      toast.error('Maximum of 10 files per post allowed');
      return;
    }
    
    const totalSizeInMB = selectedFiles.reduce((acc, file) => acc + file.size / (1024 * 1024), 0);
    if (totalSizeInMB > 500) {
      toast.error('Total file size exceeds 500MB limit');
      return;
    }
    
    const newFiles = selectedFiles.map((file, index) => {
      const isImage = file.type.startsWith('image/');
      
      return {
        ...file,
        preview: isImage ? URL.createObjectURL(file) : undefined,
        position: mediaFiles.length + index,
        progress: 0,
        status: 'pending' as const
      };
    });
    
    onChange([...mediaFiles, ...newFiles]);
  }, [mediaFiles, onChange]);
  
  const removeFile = (index: number) => {
    const newFiles = [...mediaFiles];
    
    // If it has a preview URL, revoke it to prevent memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!);
    }
    
    newFiles.splice(index, 1);
    
    // Update positions after removal
    const reorderedFiles = newFiles.map((file, i) => ({
      ...file,
      position: i
    }));
    
    onChange(reorderedFiles);
  };
  
  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === mediaFiles.length - 1)
    ) {
      return;
    }
    
    const newFiles = [...mediaFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newFiles[index].position, newFiles[targetIndex].position] = 
    [newFiles[targetIndex].position, newFiles[index].position];
    
    // Swap elements
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    
    onChange(newFiles);
  };
  
  const updateCaption = (index: number, newCaption: string) => {
    const newFiles = [...mediaFiles];
    newFiles[index].caption = newCaption;
    onChange(newFiles);
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
      addNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold text-white">Media</Label>
        <div className="flex gap-2">
          <Button 
            type="button" // Explicitly set type to button to prevent form submission
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission when clicking "Add Media"
              e.stopPropagation(); // Extra safety to stop event propagation
              console.log("Add Media button clicked, opening file selector");
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            disabled={mediaFiles.length >= 10 || isSubmitting}
            variant="outline"
            size="sm"
            className="bg-primary/10 hover:bg-primary/20 border-primary/30"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Media
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,video/*"
            disabled={mediaFiles.length >= 10 || isSubmitting}
          />
        </div>
      </div>
      
      {mediaFiles.length === 0 ? (
        <div 
          ref={dropZoneRef}
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
        </div>
      ) : (
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
                type="button" // Explicitly set type to button
                variant="ghost"
                size="sm"
                className="text-xs text-white/60 hover:text-white"
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  e.stopPropagation();
                  // Clear all files
                  mediaFiles.forEach(file => {
                    if (file.preview) {
                      URL.revokeObjectURL(file.preview);
                    }
                  });
                  onChange([]);
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
              <NewMediaFilePreview
                key={index}
                file={file}
                index={index}
                totalFiles={mediaFiles.length}
                onRemove={removeFile}
                onMove={moveFile}
                onCaptionChange={updateCaption}
                progress={uploadProgress[file.name] || 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMediaUploader;
