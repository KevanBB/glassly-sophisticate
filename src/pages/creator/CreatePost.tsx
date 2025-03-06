
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewPostEditor from '@/components/creator/content/NewPostEditor';
import { toast } from 'sonner';

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in CreatePost component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-md text-white m-4">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">There was an error creating your post. Please try again or contact support.</p>
          <pre className="bg-black/30 p-4 rounded overflow-auto text-sm">
            {this.state.error?.toString()}
          </pre>
          <Button 
            className="mt-4"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  console.log("Rendering CreatePost component");
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">Please log in to access this page</p>
      </div>
    );
  }
  
  const handleSuccess = () => {
    console.log("Post created successfully, navigating to dashboard");
    setFormSubmitted(true);
    toast.success('Post created successfully!');
    navigate('/creator/dashboard');
  };
  
  return (
    <ErrorBoundary>
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
              type="button" // Explicitly set type to button
              onClick={(e) => {
                e.preventDefault(); // Prevent any form submission
                navigate('/creator/dashboard');
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Create New Post</h1>
          </div>
          
          <NewPostEditor onSuccess={handleSuccess} />
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default CreatePost;
