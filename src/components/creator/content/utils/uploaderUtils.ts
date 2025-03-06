
import { supabase } from '@/integrations/supabase/client';
import { MediaType } from '../../profile/types';
import { toast } from 'sonner';

export type FileWithMetadata = File & { 
  preview?: string; 
  caption?: string; 
  position: number;
  progress?: number;
  status?: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
};

export type UploadProgress = { [key: string]: number };

export const getMediaType = (file: File): MediaType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'audio';
};

export const updateFileStatus = (
  fileName: string, 
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error', 
  progress: number, 
  setMediaFiles: React.Dispatch<React.SetStateAction<FileWithMetadata[]>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress>>,
  error?: string
) => {
  setMediaFiles(prev => prev.map(file => {
    if (file.name === fileName) {
      return {
        ...file,
        status,
        progress,
        error
      };
    }
    return file;
  }));
  
  setUploadProgress(prev => ({
    ...prev,
    [fileName]: progress
  }));
};

export const uploadMediaFiles = async (
  mediaFiles: FileWithMetadata[],
  userId: string,
  postId: string,
  setMediaFiles: React.Dispatch<React.SetStateAction<FileWithMetadata[]>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress>>
) => {
  try {
    // Create a storage bucket if it doesn't exist (first-time setup)
    try {
      const { data: bucketExists } = await supabase
        .storage
        .getBucket('creator_media');
        
      if (!bucketExists) {
        await supabase
          .storage
          .createBucket('creator_media', {
            public: true
          });
      }
    } catch (error) {
      console.log('Bucket already exists or creating bucket failed', error);
      // Continue anyway, it might already exist
    }

    // Upload each media file
    const uploadPromises = mediaFiles.map(async (file) => {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `${userId}/${postId}/${fileName}`;
      
      // Update status to uploading
      updateFileStatus(
        file.name, 
        'uploading', 
        1, 
        setMediaFiles, 
        setUploadProgress
      );
      
      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('creator_media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) {
        updateFileStatus(
          file.name, 
          'error', 
          0, 
          setMediaFiles, 
          setUploadProgress, 
          uploadError.message
        );
        throw uploadError;
      }
      
      // Manually track progress since we don't have real-time progress
      updateFileStatus(
        file.name, 
        'processing', 
        50, 
        setMediaFiles, 
        setUploadProgress
      );
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('creator_media')
        .getPublicUrl(filePath);
      
      // Handle video thumbnail if it's a video
      let thumbnailUrl = undefined;
      if (file.type.startsWith('video/')) {
        // In a real implementation, we would generate a thumbnail here
        // For now, we'll just use a placeholder
        thumbnailUrl = '/placeholder.svg';
      }
      
      // Update to reflect post_media creation started
      updateFileStatus(
        file.name, 
        'processing', 
        90, 
        setMediaFiles, 
        setUploadProgress
      );
      
      // Create media record
      const { data: mediaData, error: mediaError } = await supabase
        .from('post_media')
        .insert({
          post_id: postId,
          media_url: publicUrl,
          media_type: getMediaType(file),
          file_size: file.size,
          caption: file.caption || null,
          position: file.position,
          thumbnail_url: thumbnailUrl
        })
        .select()
        .single();
        
      if (mediaError) {
        updateFileStatus(
          file.name, 
          'error', 
          0, 
          setMediaFiles, 
          setUploadProgress, 
          mediaError.message
        );
        throw mediaError;
      }
      
      // Update to complete
      updateFileStatus(
        file.name, 
        'complete', 
        100, 
        setMediaFiles, 
        setUploadProgress
      );
      
      return mediaData;
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading files:', error);
    toast.error('Error uploading files');
    throw error;
  }
};
