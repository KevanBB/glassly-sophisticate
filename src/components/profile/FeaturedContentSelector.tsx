
import React, { useState, useEffect } from 'react';
import { Star, Trash, MessageSquare, Image, Video, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';

interface Post {
  id: string;
  content: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  timestamp: string;
  isFeatured: boolean;
}

interface FeaturedContentSelectorProps {
  open: boolean;
  userId: string;
  posts: Post[];
  onClose: () => void;
  onFeatureToggle: (postId: string) => void;
}

const FeaturedContentSelector = ({ 
  open, 
  userId,
  posts,
  onClose,
  onFeatureToggle
}: FeaturedContentSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [unfeaturedPosts, setUnfeaturedPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // Split posts into featured and unfeatured
    setFeaturedPosts(posts.filter(post => post.isFeatured));
    setUnfeaturedPosts(posts.filter(post => !post.isFeatured));
  }, [posts]);
  
  const getPostIcon = (post: Post) => {
    if (post.mediaType === 'image') return <Image size={16} className="text-blue-400" />;
    if (post.mediaType === 'video') return <Video size={16} className="text-purple-400" />;
    return <MessageSquare size={16} className="text-gray-400" />;
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getFilteredPosts = (postsArray: Post[]) => {
    if (!searchTerm) return postsArray;
    
    return postsArray.filter(post => 
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filteredFeatured = getFilteredPosts(featuredPosts);
  const filteredUnfeatured = getFilteredPosts(unfeaturedPosts);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-amber-400" />
            Featured Content
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select posts to feature on your profile. Featured posts will appear in a highlighted section.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-4">
          {filteredFeatured.length > 0 && (
            <div>
              <h4 className="text-white text-sm font-medium mb-2 flex items-center">
                <Star className="mr-1.5 h-4 w-4 text-amber-400" />
                Featured Posts ({filteredFeatured.length})
              </h4>
              
              <ScrollArea className="h-[120px] rounded-md border border-gray-800 bg-gray-800/50 p-2">
                {filteredFeatured.map(post => (
                  <div key={post.id} className="flex items-center justify-between py-2 px-2 hover:bg-gray-800 rounded">
                    <div className="flex items-center flex-1 min-w-0">
                      <Avatar className="h-8 w-8 mr-2">
                        <img src="https://ui-avatars.com/api/?name=User" alt="User" />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          {getPostIcon(post)}
                          <span className="text-xs text-gray-400 ml-1">
                            {formatTimestamp(post.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm truncate text-white/90">{post.content}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onFeatureToggle(post.id)}
                      className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
                
                {filteredFeatured.length === 0 && searchTerm && (
                  <p className="text-gray-500 text-center py-4">No featured posts match your search</p>
                )}
              </ScrollArea>
            </div>
          )}
          
          <div>
            <h4 className="text-white text-sm font-medium mb-2">
              Available Posts ({filteredUnfeatured.length})
            </h4>
            
            <ScrollArea className="h-[180px] rounded-md border border-gray-800 bg-gray-800/50 p-2">
              {filteredUnfeatured.length > 0 ? (
                filteredUnfeatured.map(post => (
                  <div key={post.id} className="flex items-center justify-between py-2 px-2 hover:bg-gray-800 rounded">
                    <div className="flex items-center flex-1 min-w-0">
                      <Avatar className="h-8 w-8 mr-2">
                        <img src="https://ui-avatars.com/api/?name=User" alt="User" />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          {getPostIcon(post)}
                          <span className="text-xs text-gray-400 ml-1">
                            {formatTimestamp(post.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm truncate text-white/90">{post.content}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onFeatureToggle(post.id)}
                      className="ml-2 text-amber-400 hover:text-amber-300 hover:bg-amber-950/30"
                    >
                      <Star size={16} />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  {searchTerm ? (
                    <p className="text-gray-500">No posts match your search</p>
                  ) : (
                    <p className="text-gray-500">No posts available to feature</p>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-white">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturedContentSelector;
