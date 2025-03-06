import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  PlusCircle, Upload, X, MoveUp, MoveDown, 
  Image as ImageIcon, Video, FileText, Loader2, LayoutGrid, Eye, Lock, Tag 
} from 'lucide-react';
import { MediaType, PostVisibility } from '../profile/types';
import GlassPanel from '@/components/ui/GlassPanel';

interface PostEditorProps {
  onSuccess?: () => void;
}

const PostEditor = ({ onSuccess }: PostEditorProps) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [mediaFiles, setMediaFiles] = useState<(File & { 
    preview?: string; 
    caption?: string; 
    position: number;
    progress?: number;
    status?: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    error?: string;
  })[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [visibility, setVisibility] = useState<PostVisibility>('free');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setMediaFiles([...mediaFiles, ...newFiles]);
    
    // Initialize progress for new files
    const newProgress = { ...uploadProgress };
    newFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
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
    
    const removedFile = newFiles[index];
    newFiles.splice(index, 1);
    
    // Update positions after removal
    const reorderedFiles = newFiles.map((file, i) => ({
      ...file,
      position: i
    }));
    
    setMediaFiles(reorderedFiles);
    
    // Remove from progress tracking
    const newProgress = { ...uploadProgress };
    delete newProgress[removedFile.name];
    setUploadProgress(newProgress);
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
    
    setMediaFiles(newFiles);
  };
  
  const updateCaption = (index: number, newCaption: string) => {
    const newFiles = [...mediaFiles];
    newFiles[index].caption = newCaption;
    setMediaFiles(newFiles);
  };
  
  const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'audio';
  };

  const updateFileStatus = (fileName: string, status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error', progress: number, error?: string) => {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    if (mediaFiles.length === 0) {
      toast.error('Please add at least one media file');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 1. Create post record
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          creator_id: user.id,
          title: title || null,
          caption,
          visibility,
          price: visibility === 'ppv' ? price : null,
          tags: tags.length > 0 ? tags : [],
        })
        .select()
        .single();
      
      if (postError) throw postError;
      
      // 2. Upload each media file
      const uploadPromises = mediaFiles.map(async (file, index) => {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `${user.id}/${postData.id}/${fileName}`;
        
        // Update status to uploading
        updateFileStatus(file.name, 'uploading', 1);
        
        // Create a storage bucket if it doesn't exist (first-time setup)
        // This would normally be done via SQL migration
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
        
        // Upload file with progress tracking
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('creator_media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              const percent = Math.round((progress.loaded / progress.total) * 70);
              updateFileStatus(file.name, 'uploading', percent);
            }
          });
        
        if (uploadError) {
          updateFileStatus(file.name, 'error', 0, uploadError.message);
          throw uploadError;
        }
        
        // Update progress to processing stage
        updateFileStatus(file.name, 'processing', 75);
        
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
        updateFileStatus(file.name, 'processing', 90);
        
        // 3. Create media record
        const { data: mediaData, error: mediaError } = await supabase
          .from('post_media')
          .insert({
            post_id: postData.id,
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
          updateFileStatus(file.name, 'error', 0, mediaError.message);
          throw mediaError;
        }
        
        // Update to complete
        updateFileStatus(file.name, 'complete', 100);
        
        return mediaData;
      });
      
      await Promise.all(uploadPromises);
      
      toast.success('Post created successfully!');
      
      // Reset form
      setCaption('');
      setTitle('');
      setMediaFiles([]);
      setTags([]);
      setVisibility('free');
      setPrice(undefined);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'pending': return 'Ready to upload';
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'complete': return 'Uploaded';
      case 'error': return 'Upload failed';
      default: return 'Pending';
    }
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-400';
      case 'uploading': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <GlassPanel className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            placeholder="Post title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 border-white/10 mb-4"
          />
          
          <Textarea
            placeholder="Write your caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px] bg-background/50 border-white/10"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Media</h3>
            <div className="flex gap-2">
              <Button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
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
                <div key={index} className="border border-white/10 rounded-md overflow-hidden bg-background/50">
                  <div className="relative">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.preview} 
                        alt={`Preview ${index}`}
                        className="w-full aspect-video object-cover" 
                      />
                    ) : file.type.startsWith('video/') ? (
                      <div className="w-full aspect-video bg-black/50 flex items-center justify-center">
                        <Video className="w-12 h-12 text-white/60" />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-black/50 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-white/60" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Status indicator overlay */}
                    {file.status && file.status !== 'complete' && file.status !== 'pending' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                          <span className="text-white text-sm">{getStatusText(file.status)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 truncate max-w-[70%]">
                        {file.status === 'complete' && (
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                        <span className="text-sm text-white/70 truncate">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === mediaFiles.length - 1}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add caption..."
                        value={file.caption || ''}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        className="text-sm bg-background/30 border-white/10"
                      />
                    </div>
                    
                    {/* Status bar - show for all files whether or not they're being uploaded */}
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-white/70">
                        <span>{getStatusText(file.status)}</span>
                        {file.progress !== undefined && <span>{file.progress}%</span>}
                      </div>
                      <div className="w-full bg-background/30 rounded-full h-1.5">
                        <div 
                          className={`${getStatusColor(file.status)} h-1.5 rounded-full transition-all duration-200`} 
                          style={{ width: `${file.progress || 0}%` }}
                        ></div>
                      </div>
                      {file.error && (
                        <p className="text-xs text-red-400 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Visibility</h3>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant={visibility === 'free' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setVisibility('free')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Free - Available to everyone
              </Button>
              <Button
                type="button"
                variant={visibility === 'subscriber' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setVisibility('subscriber')}
              >
                <Lock className="w-4 h-4 mr-2" />
                Subscribers Only
              </Button>
              <Button
                type="button"
                variant={visibility === 'ppv' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setVisibility('ppv')}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Pay-Per-View
              </Button>
              
              {visibility === 'ppv' && (
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Price ($)"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="0.99"
                    step="0.01"
                    className="bg-background/50 border-white/10"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
            <div className="border border-white/10 rounded-md p-3 bg-background/50">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="bg-primary/80 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      if (tags.length < 10) {
                        const newTag = e.currentTarget.value.trim();
                        if (newTag && !tags.includes(newTag)) {
                          setTags([...tags, newTag]);
                          e.currentTarget.value = '';
                        }
                      } else {
                        toast.error('Maximum of 10 tags allowed');
                      }
                    }
                  }}
                  className="bg-background/30 border-white/10"
                />
              </div>
              <p className="text-xs text-white/60 mt-2">Press Enter to add a tag (max 10)</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || mediaFiles.length === 0}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create Post
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassPanel>
  );
};

export default PostEditor;
