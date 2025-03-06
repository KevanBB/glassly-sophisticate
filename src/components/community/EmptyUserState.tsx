
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EmptyUserStateProps {
  onRefresh: () => void;
}

const EmptyUserState = ({ onRefresh }: EmptyUserStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-white/60">
      <Users size={48} className="mb-4 opacity-50" />
      <p>No users found matching your criteria</p>
      <Button variant="link" onClick={onRefresh} className="mt-2">
        Refresh
      </Button>
    </div>
  );
};

export default EmptyUserState;
