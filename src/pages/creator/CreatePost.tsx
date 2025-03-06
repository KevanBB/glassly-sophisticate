
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostEditor from '@/components/creator/content/PostEditor';
import { toast } from 'sonner';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">Please log in to access this page</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/creator/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Create New Post</h1>
        </div>
        
        <PostEditor 
          onSuccess={() => {
            toast.success('Post created successfully!');
            navigate('/creator/dashboard');
          }} 
        />
      </div>
    </motion.div>
  );
};

export default CreatePost;
