
import React from 'react';

interface MemberListSkeletonProps {
  count?: number;
}

const MemberListSkeleton = ({ count = 5 }: MemberListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-white/10"></div>
          <div className="flex-1">
            <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
            <div className="h-4 w-24 bg-white/5 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberListSkeleton;
