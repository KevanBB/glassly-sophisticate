
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import MediaFilePreview from './MediaFilePreview';
import { FileWithMetadata } from './utils/uploaderUtils';

interface MediaUploaderProps {
  mediaFiles: FileWithMetadata[];
  isSubmitting: boolean;
  onChange: (files: FileWithMetadata[]) => void;
}

const MediaUploader = ({ mediaFiles, isSubmitting, onChange }: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent form submission when a file is selected
    e.preventDefault();
    
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
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
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Media</h3>
        <div className="flex gap-2">
          <Button 
            type="button"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission when clicking "Add Media"
              fileInputRef.current?.click();
            }}
            disabled={mediaFiles.length >= 10 || isSubmitting}
            variant="outline"
            size="sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Media
          </Button>
          <Input
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
        <div className="border-2 border-dashed border-white/10 rounded-md p-8 text-center bg-background/30">
          <div className="flex flex-col items-center justify-center gap-2 text-white/60">
            <Upload className="w-8 h-8" />
            <p>Drag files here or click Add Media to upload</p>
            <p className="text-sm">Up to 10 files, max 500MB total</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediaFiles.map((file, index) => (
            <MediaFilePreview
              key={index}
              file={file}
              index={index}
              totalFiles={mediaFiles.length}
              onRemove={removeFile}
              onMove={moveFile}
              onCaptionChange={updateCaption}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
