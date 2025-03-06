
import React from 'react';

interface UserGridSkeletonProps {
  count?: number;
}

const UserGridSkeleton = ({ count = 6 }: UserGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-2 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-white/10"></div>
          <div className="h-4 w-20 bg-white/10 rounded"></div>
          <div className="h-3 w-16 bg-white/5 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default UserGridSkeleton;
