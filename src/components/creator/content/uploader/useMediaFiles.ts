
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FileWithMetadata } from '../utils/uploaderUtils';

export const useMediaFiles = (
  initialFiles: FileWithMetadata[] = [], 
  onChange: (files: FileWithMetadata[]) => void
) => {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const addFiles = useCallback((selectedFiles: File[]) => {
    const totalFilesAfterAddition = initialFiles.length + selectedFiles.length;
    
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
        position: initialFiles.length + index,
        progress: 0,
        status: 'pending' as const
      };
    });
    
    onChange([...initialFiles, ...newFiles]);
  }, [initialFiles, onChange]);
  
  const removeFile = useCallback((index: number) => {
    const newFiles = [...initialFiles];
    
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
  }, [initialFiles, onChange]);
  
  const moveFile = useCallback((index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === initialFiles.length - 1)
    ) {
      return;
    }
    
    const newFiles = [...initialFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newFiles[index].position, newFiles[targetIndex].position] = 
    [newFiles[targetIndex].position, newFiles[index].position];
    
    // Swap elements
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    
    onChange(newFiles);
  }, [initialFiles, onChange]);
  
  const updateCaption = useCallback((index: number, newCaption: string) => {
    const newFiles = [...initialFiles];
    newFiles[index].caption = newCaption;
    onChange(newFiles);
  }, [initialFiles, onChange]);

  const clearAllFiles = useCallback(() => {
    // Clear all files
    initialFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    onChange([]);
  }, [initialFiles, onChange]);

  return {
    uploadProgress,
    setUploadProgress,
    addFiles,
    removeFile,
    moveFile,
    updateCaption,
    clearAllFiles
  };
};
