
import React from 'react';

interface ProgressBarProps {
  progress: number;
  status?: string;
}

const ProgressBar = ({ progress, status }: ProgressBarProps) => {
  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between text-xs text-white/70">
        <span>{getStatusText(status)}</span>
        {progress > 0 && progress < 100 && <span>{progress}%</span>}
      </div>
      <div className="w-full bg-background/30 rounded-full h-1.5">
        <div 
          className={`${getStatusColor(status)} h-1.5 rounded-full transition-all duration-200`} 
          style={{ width: `${progress || 0}%` }}
        ></div>
      </div>
    </div>
  );
};

const getStatusText = (status?: string) => {
  switch (status) {
    case 'pending': return 'Ready to upload';
    case 'uploading': return 'Uploading...';
    case 'processing': return 'Processing...';
    case 'complete': return 'Uploaded';
    case 'error': return 'Upload failed';
    default: return 'Pending';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'pending': return 'bg-gray-400';
    case 'uploading': return 'bg-blue-500';
    case 'processing': return 'bg-yellow-500';
    case 'complete': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

export default ProgressBar;
