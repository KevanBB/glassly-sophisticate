
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
  media_url?: string; // Added field to store the uploaded file URL
};

export type UploadProgress = { [key: string]: number };

export const getMediaType = (file: File): MediaType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'audio';
};

// Function to create the creator_media bucket if it doesn't exist
export const ensureMediaBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) throw listError;
    
    const bucketExists = buckets.some(bucket => bucket.name === 'creator_media');
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket('creator_media', {
          public: true,
          fileSizeLimit: 524288000 // 500MB in bytes
        });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
};

export const updateFileStatus = (
  fileName: string, 
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error', 
  progress: number, 
  setMediaFiles: React.Dispatch<React.SetStateAction<FileWithMetadata[]>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress>>,
  error?: string,
  media_url?: string
) => {
  setMediaFiles(prev => prev.map(file => {
    if (file.name === fileName) {
      return {
        ...file,
        status,
        progress,
        error,
        ...(media_url ? { media_url } : {})
      };
    }
    return file;
  }));
  
  setUploadProgress(prev => ({
    ...prev,
    [fileName]: progress
  }));
};

// Function to upload a single file to Supabase
export const uploadSingleFile = async (
  file: FileWithMetadata,
  userId: string,
  setMediaFiles: React.Dispatch<React.SetStateAction<FileWithMetadata[]>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress>>
): Promise<string | null> => {
  try {
    // Ensure the creator_media bucket exists
    const bucketReady = await ensureMediaBucketExists();
    if (!bucketReady) {
      throw new Error('Storage bucket not available');
    }
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `${userId}/${fileName}`;
    
    // Update status to uploading and set initial progress
    updateFileStatus(
      file.name, 
      'uploading', 
      5, 
      setMediaFiles, 
      setUploadProgress
    );
    
    // Upload file to Supabase Storage
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
    
    // Update progress to processing
    updateFileStatus(
      file.name, 
      'processing', 
      70, 
      setMediaFiles, 
      setUploadProgress
    );
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('creator_media')
      .getPublicUrl(filePath);
    
    // Update to complete with the public URL
    updateFileStatus(
      file.name, 
      'complete', 
      100, 
      setMediaFiles, 
      setUploadProgress,
      undefined,
      publicUrl
    );
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    updateFileStatus(
      file.name, 
      'error', 
      0, 
      setMediaFiles, 
      setUploadProgress, 
      error instanceof Error ? error.message : 'Upload failed'
    );
    return null;
  }
};

// Updated function to handle final upload and create post_media records
export const uploadMediaFiles = async (
  mediaFiles: FileWithMetadata[],
  userId: string,
  postId: string,
  setMediaFiles: React.Dispatch<React.SetStateAction<FileWithMetadata[]>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress>>
) => {
  try {
    // Process files that haven't been uploaded yet or failed
    const postMediaPromises = mediaFiles.map(async (file) => {
      let mediaUrl = file.media_url;
      
      // If the file hasn't been uploaded or failed previously, upload it now
      if (!mediaUrl || file.status === 'error') {
        // File wasn't uploaded automatically, so upload it now
        mediaUrl = await uploadSingleFile(file, userId, setMediaFiles, setUploadProgress);
        if (!mediaUrl) {
          throw new Error(`Failed to upload file: ${file.name}`);
        }
      }
      
      // Generate thumbnail for videos (placeholder for now)
      let thumbnailUrl = undefined;
      if (file.type.startsWith('video/')) {
        thumbnailUrl = '/placeholder.svg';
      }
      
      // Create media record
      const { data: mediaData, error: mediaError } = await supabase
        .from('post_media')
        .insert({
          post_id: postId,
          media_url: mediaUrl,
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
      
      return mediaData;
    });
    
    return await Promise.all(postMediaPromises);
  } catch (error) {
    console.error('Error creating post media records:', error);
    toast.error('Error finalizing media uploads');
    throw error;
  }
};
