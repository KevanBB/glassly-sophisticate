
import React from 'react';
import { motion } from 'framer-motion';
import { Post, ViewType } from './types';
import PostCard from '../content/PostCard';

interface PostsGridProps {
  posts: Post[];
  viewType: ViewType;
}

const PostsGrid = ({ posts, viewType }: PostsGridProps) => {
  return (
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
  );
};

export default PostsGrid;
