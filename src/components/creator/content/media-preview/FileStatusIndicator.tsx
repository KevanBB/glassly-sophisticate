
import React from 'react';
import { Loader2 } from 'lucide-react';

interface FileStatusIndicatorProps {
  status?: string;
}

const FileStatusIndicator = ({ status }: FileStatusIndicatorProps) => {
  if (!status || status === 'complete' || status === 'pending') {
    return null;
  }
  
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
        <span className="text-white text-sm">{getStatusText(status)}</span>
      </div>
    </div>
  );
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Ready to upload';
    case 'uploading': return 'Uploading...';
    case 'processing': return 'Processing...';
    case 'complete': return 'Uploaded';
    case 'error': return 'Upload failed';
    default: return 'Pending';
  }
};

export { getStatusText };
export default FileStatusIndicator;
