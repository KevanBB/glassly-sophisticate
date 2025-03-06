
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { FileWithMetadata, uploadSingleFile } from '../utils/uploaderUtils';
import { useAuth } from '@/context/AuthContext';

export const useMediaFiles = (
  initialFiles: FileWithMetadata[] = [], 
  onChange: (files: FileWithMetadata[]) => void
) => {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { user } = useAuth();

  // Upload files automatically when they're added
  useEffect(() => {
    const uploadPendingFiles = async () => {
      if (!user) return;
      
      // Find files that need to be uploaded (status is pending)
      const pendingFiles = initialFiles.filter(file => 
        file.status === 'pending' && !file.media_url
      );
      
      if (pendingFiles.length === 0) return;
      
      // Upload each pending file
      for (const file of pendingFiles) {
        await uploadSingleFile(file, user.id, setFiles, setUploadProgress);
      }
    };
    
    uploadPendingFiles();
  }, [initialFiles, user]);

  const setFiles = useCallback((newFiles: FileWithMetadata[] | ((prev: FileWithMetadata[]) => FileWithMetadata[])) => {
    onChange(typeof newFiles === 'function' ? newFiles(initialFiles) : newFiles);
  }, [initialFiles, onChange]);

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
    
    setFiles([...initialFiles, ...newFiles]);
  }, [initialFiles, setFiles]);
  
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
    
    setFiles(reorderedFiles);
  }, [initialFiles, setFiles]);
  
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
    
    setFiles(newFiles);
  }, [initialFiles, setFiles]);
  
  const updateCaption = useCallback((index: number, newCaption: string) => {
    const newFiles = [...initialFiles];
    newFiles[index].caption = newCaption;
    setFiles(newFiles);
  }, [initialFiles, setFiles]);

  const clearAllFiles = useCallback(() => {
    // Clear all files
    initialFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [initialFiles, setFiles]);

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
