
import { useState, useEffect } from 'react';
import { Post, Media, MediaType, PostVisibility } from '@/components/creator/profile/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCreatorPosts(creatorId?: string, username?: string) {
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
            .maybeSingle();
            
          if (userError || !userData) {
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
            
            // Validate that the visibility is one of the allowed values
            let postVisibility: PostVisibility = 'free';
            
            if (post.visibility === 'free' || post.visibility === 'subscriber' || post.visibility === 'ppv') {
              postVisibility = post.visibility as PostVisibility;
            }
            
            // Create a properly typed Post object
            const typedPost: Post = {
              id: post.id,
              creator_id: post.creator_id,
              title: post.title || undefined,
              caption: post.caption || '',
              media: formattedMedia,
              visibility: postVisibility,
              price: post.price || undefined,
              tags: post.tags || [],
              created_at: post.created_at,
              updated_at: post.updated_at,
              likes_count: 0, // Default value since it might not exist in the database
              comments_count: 0 // Default value since it might not exist in the database
            };
            
            return typedPost;
          })
        );
        
        setPosts(postsWithMedia as Post[]);
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

  return { posts, loading, error };
}
