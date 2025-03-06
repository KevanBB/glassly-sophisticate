
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ViewType, Post, Media, MediaType, PostVisibility } from './types';
import { Button } from '@/components/ui/button';
import { Grid2X2, List, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PostCard from '../content/PostCard';
import { toast } from 'sonner';

interface MediaGalleryProps {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
  creatorId?: string;
  username?: string;
}

const MediaGallery = ({ viewType, onViewChange, creatorId, username }: MediaGalleryProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // If we have a username but no creatorId, we need to fetch the creator's ID first
        let targetCreatorId = creatorId;
        
        if (!targetCreatorId && username) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('creator_username', username)
            .single();
            
          if (userError) {
            throw new Error('Creator not found');
          }
          
          targetCreatorId = userData.id;
        }
        
        if (!targetCreatorId) {
          throw new Error('No creator specified');
        }
        
        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', targetCreatorId)
          .order('created_at', { ascending: false });
          
        if (postsError) {
          throw postsError;
        }
        
        // For each post, fetch its media
        const postsWithMedia = await Promise.all(
          postsData.map(async (post) => {
            const { data: mediaData, error: mediaError } = await supabase
              .from('post_media')
              .select('*')
              .eq('post_id', post.id)
              .order('position', { ascending: true });
              
            if (mediaError) {
              console.error('Error fetching media for post:', mediaError);
              return {
                ...post,
                media: []
              };
            }
            
            // Convert database media to our Media type
            const formattedMedia: Media[] = mediaData.map(media => ({
              id: media.id,
              url: media.media_url,
              type: media.media_type as MediaType,
              thumbnail: media.thumbnail_url || undefined,
              caption: media.caption || undefined,
              file_size: media.file_size,
              position: media.position,
              created_at: media.created_at,
              post_id: media.post_id,
              media_url: media.media_url,
              media_type: media.media_type,
              thumbnail_url: media.thumbnail_url
            }));
            
            return {
              ...post,
              media: formattedMedia,
              visibility: post.visibility as PostVisibility
            };
          })
        );
        
        setPosts(postsWithMedia);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to load posts');
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [creatorId, username]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <div className="bg-card rounded-lg p-1 flex gap-1">
            <Button
              variant={viewType === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeline')}
            >
              <List className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
            >
              <Grid2X2 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <div className="bg-card rounded-lg p-1 flex gap-1">
            <Button
              variant={viewType === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeline')}
            >
              <List className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
            >
              <Grid2X2 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12 text-white/60">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* View Toggle */}
      <div className="flex justify-end mb-6">
        <div className="bg-card rounded-lg p-1 flex gap-1">
          <Button
            variant={viewType === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('timeline')}
          >
            <List className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={viewType === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('grid')}
          >
            <Grid2X2 className="w-4 h-4 mr-2" />
            Grid
          </Button>
        </div>
      </div>

      {/* Content */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60">No posts yet</p>
        </div>
      ) : (
        <motion.div
          layout
          className={`gap-6 ${
            viewType === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-6'
          }`}
        >
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              viewType={viewType} 
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MediaGallery;
