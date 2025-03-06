
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
