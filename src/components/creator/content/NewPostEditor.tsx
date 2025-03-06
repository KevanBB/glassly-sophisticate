
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { PostVisibility } from '../profile/types';
import GlassPanel from '@/components/ui/GlassPanel';
import NewMediaUploader from './NewMediaUploader';
import VisibilitySelector from './VisibilitySelector';
import TagsSelector from './TagsSelector';
import { FileWithMetadata, uploadMediaFiles } from './utils/uploaderUtils';

interface PostEditorProps {
  onSuccess?: () => void;
}

const NewPostEditor = ({ onSuccess }: PostEditorProps) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [mediaFiles, setMediaFiles] = useState<FileWithMetadata[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [visibility, setVisibility] = useState<PostVisibility>('free');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // 2. Upload files and create media records
      await uploadMediaFiles(
        mediaFiles,
        user.id,
        postData.id,
        setMediaFiles,
        setUploadProgress
      );
      
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
  
  return (
    <GlassPanel className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Post title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-white/10 text-lg"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="relative">
            <Textarea
              placeholder="Write your caption here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[120px] bg-background/50 border-white/10 resize-y"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <NewMediaUploader 
          mediaFiles={mediaFiles}
          isSubmitting={isSubmitting}
          onChange={setMediaFiles}
          uploadProgress={uploadProgress}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VisibilitySelector
            visibility={visibility}
            price={price}
            onVisibilityChange={setVisibility}
            onPriceChange={setPrice}
          />
          
          <TagsSelector
            tags={tags}
            onTagsChange={setTags}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || mediaFiles.length === 0}
            className="min-w-[120px]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Post...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </div>
      </form>
    </GlassPanel>
  );
};

export default NewPostEditor;
