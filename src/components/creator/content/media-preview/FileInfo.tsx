
import React from 'react';

interface FileInfoProps {
  fileName: string;
  status?: string;
  error?: string;
}

const FileInfo = ({ fileName, status, error }: FileInfoProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 truncate max-w-[70%]">
        {status === 'complete' && (
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        )}
        <span className="text-sm text-white/70 truncate">
          {fileName}
        </span>
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FileInfo;
