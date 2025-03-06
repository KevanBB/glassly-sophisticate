
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface MediaUploaderHeaderProps {
  onAddMediaClick: () => void;
  isDisabled: boolean;
}

const MediaUploaderHeader = ({ onAddMediaClick, isDisabled }: MediaUploaderHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-lg font-semibold text-white">Media</Label>
      <div className="flex gap-2">
        <Button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddMediaClick();
          }}
          disabled={isDisabled}
          variant="outline"
          size="sm"
          className="bg-primary/10 hover:bg-primary/20 border-primary/30"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>
    </div>
  );
};

export default MediaUploaderHeader;
