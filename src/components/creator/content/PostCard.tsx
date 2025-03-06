
import React from 'react';
import { motion } from 'framer-motion';
import { Post, ViewType } from '../profile/types';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';

interface PostCardProps {
  post: Post;
  viewType: ViewType;
}

const PostCard = ({ post, viewType }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const isSubscriberOnly = post.visibility === 'subscriber';
  const isPPV = post.visibility === 'ppv';
  
  const mainMedia = post.media.length > 0 ? post.media[0] : null;
  
  return (
    <motion.div layout>
      <GlassPanel className="overflow-hidden">
        {viewType === 'grid' ? (
          <>
            {/* Grid View */}
            <div className="relative">
              {mainMedia ? (
                mainMedia.type === 'image' ? (
                  <img 
                    src={mainMedia.url} 
                    alt={mainMedia.caption || 'Post image'}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-black flex items-center justify-center">
                    <video 
                      src={mainMedia.url}
                      poster={mainMedia.thumbnail}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" size="sm">Play</Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full aspect-square bg-slate-800" />
              )}
              
              {post.media.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                  +{post.media.length - 1}
                </div>
              )}
              
              {(isSubscriberOnly || isPPV) && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {isPPV ? `$${post.price?.toFixed(2)}` : 'Subscribers'}
                </div>
              )}
            </div>
            
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-white/70">{formatDate(post.created_at)}</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center text-white/70 text-sm">
                    <Heart className="w-4 h-4 mr-1" /> 
                    {post.likes_count || 0}
                  </span>
                  <span className="flex items-center text-white/70 text-sm">
                    <MessageCircle className="w-4 h-4 mr-1" /> 
                    {post.comments_count || 0}
                  </span>
                </div>
              </div>
              
              <p className="text-white line-clamp-2">{post.caption}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-white/50">+{post.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Timeline View */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {post.title || 'Untitled Post'}
                </h3>
                <p className="text-sm text-white/70">{formatDate(post.created_at)}</p>
              </div>
              
              <p className="text-white mb-4">{post.caption}</p>
              
              {post.media.length > 0 && (
                <div className="mb-4">
                  {mainMedia?.type === 'image' ? (
                    <img 
                      src={mainMedia.url} 
                      alt={mainMedia.caption || 'Post image'}
                      className="w-full max-h-[500px] object-cover rounded-md"
                    />
                  ) : mainMedia?.type === 'video' ? (
                    <video 
                      src={mainMedia.url}
                      poster={mainMedia.thumbnail}
                      controls
                      className="w-full max-h-[500px] object-cover rounded-md"
                    />
                  ) : null}
                  
                  {mainMedia?.caption && (
                    <p className="mt-2 text-sm text-white/70 italic">{mainMedia.caption}</p>
                  )}
                  
                  {post.media.length > 1 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {post.media.slice(1, 5).map((media, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                          {media.type === 'image' ? (
                            <img 
                              src={media.url} 
                              alt={media.caption || `Additional media ${index}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                              <img
                                src={media.thumbnail || '/placeholder.svg'}
                                alt={media.caption || `Video thumbnail ${index}`}
                                className="w-full h-full object-cover opacity-70"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full p-0">
                                  <span className="sr-only">Play video</span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    className="w-4 h-4"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {index === 3 && post.media.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-medium">+{post.media.length - 5}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-white/70">
                    <Heart className="w-4 h-4 mr-2" />
                    {post.likes_count || 0}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/70">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {post.comments_count || 0}
                  </Button>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {(isSubscriberOnly || isPPV) && (
                <div className="mt-3 flex items-center justify-end">
                  <div className="bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {isPPV ? `$${post.price?.toFixed(2)}` : 'Subscribers Only'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </GlassPanel>
    </motion.div>
  );
};

export default PostCard;
