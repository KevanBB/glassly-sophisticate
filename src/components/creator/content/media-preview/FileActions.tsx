
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, MoveUp, MoveDown } from 'lucide-react';

interface FileActionsProps {
  index: number;
  totalFiles: number;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const FileActions = ({ index, totalFiles, onRemove, onMove }: FileActionsProps) => {
  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="h-8 w-8 bg-black/70 border border-white/10 backdrop-blur-sm hover:bg-red-600"
          onClick={() => onRemove(index)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
        >
          <MoveUp className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onMove(index, 'down')}
          disabled={index === totalFiles - 1}
        >
          <MoveDown className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default FileActions;
