
import React, { useState } from 'react';
import { ViewType } from './types';
import ViewSwitcher from './ViewSwitcher';
import MediaGalleryLoading from './MediaGalleryLoading';
import MediaGalleryError from './MediaGalleryError';
import MediaGalleryEmpty from './MediaGalleryEmpty';
import PostsGrid from './PostsGrid';
import { useCreatorPosts } from '@/hooks/useCreatorPosts';

interface MediaGalleryProps {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
  creatorId?: string;
  username?: string;
}

const MediaGallery = ({ viewType, onViewChange, creatorId, username }: MediaGalleryProps) => {
  const { posts, loading, error } = useCreatorPosts(creatorId, username);
  
  if (loading) {
    return <MediaGalleryLoading viewType={viewType} onViewChange={onViewChange} />;
  }
  
  if (error) {
    return <MediaGalleryError viewType={viewType} onViewChange={onViewChange} error={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ViewSwitcher viewType={viewType} onViewChange={onViewChange} />

      {/* Content */}
      {posts.length === 0 ? (
        <MediaGalleryEmpty />
      ) : (
        <PostsGrid posts={posts} viewType={viewType} />
      )}
    </div>
  );
};

export default MediaGallery;
