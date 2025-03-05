
import React, { useState, useEffect } from 'react';
import { MessageSquare, Image, Video, Heart, Send, MoreHorizontal, Star, Plus } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isFeatured: boolean;
  isLiked: boolean;
}

interface WallTabProps {
  profile: any;
  user: any;
  isEditing: boolean;
}

const WallTab = ({ profile, user, isEditing }: WallTabProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // This would normally fetch posts from the database
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Self',
        userAvatar: profile?.avatar_url,
        content: 'Just updated my profile with some new interests! Check them out and let me know what you think.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 5,
        comments: 2,
        isFeatured: true,
        isLiked: false
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Alex Thompson',
        userAvatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=random',
        content: 'Great meeting you last weekend at the event!',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        likes: 1,
        comments: 1,
        isFeatured: false,
        isLiked: true
      },
      {
        id: '3',
        userId: 'user1',
        userName: 'Self',
        userAvatar: profile?.avatar_url,
        content: 'Just attended an amazing workshop on communication. Learned so much!',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1373&q=80',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        likes: 12,
        comments: 3,
        isFeatured: true,
        isLiked: false
      }
    ];
    
    setPosts(mockPosts);
    setFeaturedPosts(mockPosts.filter(post => post.isFeatured));
  }, [profile]);
  
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter something to post');
      return;
    }
    
    // This would normally save to the database
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user?.id,
      userName: 'Self',
      userAvatar: profile?.avatar_url,
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isFeatured: false,
      isLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success('Post created successfully!');
  };
  
  const handleLikePost = (postId: string) => {
    // This would normally update the database
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };
  
  const handleToggleFeature = (postId: string) => {
    // This would normally update the database
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updated = { ...post, isFeatured: !post.isFeatured };
        
        // Update featured posts list
        if (updated.isFeatured) {
          setFeaturedPosts([...featuredPosts, updated]);
        } else {
          setFeaturedPosts(featuredPosts.filter(p => p.id !== postId));
        }
        
        return updated;
      }
      return post;
    }));
    
    toast.success('Featured posts updated');
  };
  
  const handleDeletePost = (postId: string) => {
    // This would normally delete from the database
    setPosts(posts.filter(post => post.id !== postId));
    setFeaturedPosts(featuredPosts.filter(post => post.id !== postId));
    toast.success('Post deleted successfully');
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInHours < 48) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-white mb-4">Wall</h2>
        
        {/* Create post */}
        <GlassPanel className="p-4">
          <Textarea 
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="bg-white/5 border-white/10 text-white resize-none mb-3"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Image size={18} className="mr-1" />
                Photo
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Video size={18} className="mr-1" />
                Video
              </Button>
            </div>
            <Button onClick={handleCreatePost}>
              <Send size={16} className="mr-2" />
              Post
            </Button>
          </div>
        </GlassPanel>
      </div>
      
      {/* Featured posts */}
      {featuredPosts.length > 0 && (
        <div>
          <div className="flex items-center text-white mb-2">
            <Star size={16} className="text-amber-400 mr-2" />
            <h3 className="font-medium">Featured Posts</h3>
          </div>
          
          <GlassPanel className="p-4 space-y-4">
            {featuredPosts.map(post => (
              <div key={post.id} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start">
                  <Avatar className="mr-3 h-10 w-10">
                    <img 
                      src={post.userAvatar || `https://ui-avatars.com/api/?name=${post.userName}`} 
                      alt={post.userName} 
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-white font-medium">{post.userName}</h4>
                        <p className="text-white/60 text-xs">{formatTimestamp(post.timestamp)}</p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-auto"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                          <DropdownMenuItem onClick={() => handleToggleFeature(post.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            <span>Unfeature</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-500">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-white mt-2 whitespace-pre-wrap">{post.content}</p>
                    
                    {post.mediaType === 'image' && post.mediaUrl && (
                      <div className="mt-3 rounded-md overflow-hidden">
                        <img 
                          src={post.mediaUrl} 
                          alt="Post media" 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    
                    {post.mediaType === 'video' && post.mediaUrl && (
                      <div className="mt-3 rounded-md overflow-hidden">
                        <video 
                          src={post.mediaUrl}
                          controls
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center mt-3 text-sm">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLikePost(post.id)}
                        className={`text-white/70 hover:text-white hover:bg-white/10 ${post.isLiked ? 'text-red-400' : ''}`}
                      >
                        <Heart size={16} className={post.isLiked ? 'fill-current text-red-400' : ''} />
                        <span className="ml-1">{post.likes}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/70 hover:text-white hover:bg-white/10 ml-2"
                      >
                        <MessageSquare size={16} />
                        <span className="ml-1">{post.comments}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </GlassPanel>
        </div>
      )}
      
      {/* All posts */}
      <GlassPanel className="p-4 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
            <div className="flex items-start">
              <Avatar className="mr-3 h-10 w-10">
                <img 
                  src={post.userAvatar || `https://ui-avatars.com/api/?name=${post.userName}`} 
                  alt={post.userName} 
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-white font-medium">{post.userName}</h4>
                    <p className="text-white/60 text-xs">{formatTimestamp(post.timestamp)}</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-auto"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuItem onClick={() => handleToggleFeature(post.id)}>
                        <Star className="mr-2 h-4 w-4" />
                        <span>{post.isFeatured ? 'Unfeature' : 'Feature'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-white mt-2 whitespace-pre-wrap">{post.content}</p>
                
                {post.mediaType === 'image' && post.mediaUrl && (
                  <div className="mt-3 rounded-md overflow-hidden">
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                {post.mediaType === 'video' && post.mediaUrl && (
                  <div className="mt-3 rounded-md overflow-hidden">
                    <video 
                      src={post.mediaUrl}
                      controls
                      className="w-full"
                    />
                  </div>
                )}
                
                <div className="flex items-center mt-3 text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleLikePost(post.id)}
                    className={`text-white/70 hover:text-white hover:bg-white/10 ${post.isLiked ? 'text-red-400' : ''}`}
                  >
                    <Heart size={16} className={post.isLiked ? 'fill-current text-red-400' : ''} />
                    <span className="ml-1">{post.likes}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white hover:bg-white/10 ml-2"
                  >
                    <MessageSquare size={16} />
                    <span className="ml-1">{post.comments}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-6">
            <MessageSquare size={36} className="text-white/20 mx-auto mb-2" />
            <p className="text-white/60">No posts yet</p>
            <Button className="mt-3">
              <Plus size={16} className="mr-1" /> Create Your First Post
            </Button>
          </div>
        )}
      </GlassPanel>
      
      {posts.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/5"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default WallTab;
