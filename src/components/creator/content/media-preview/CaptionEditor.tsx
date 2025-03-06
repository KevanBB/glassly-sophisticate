
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Check } from 'lucide-react';

interface CaptionEditorProps {
  caption?: string;
  onCaptionChange: (caption: string) => void;
}

const CaptionEditor = ({ caption, onCaptionChange }: CaptionEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [captionText, setCaptionText] = useState(caption || '');
  
  const saveCaption = () => {
    onCaptionChange(captionText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveCaption();
    }
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add caption..."
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm bg-background/30 border-white/10"
          autoFocus
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 flex-shrink-0"
          onClick={saveCaption}
        >
          <Check className="w-4 h-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div 
      className="flex items-center gap-2 py-1.5 px-3 bg-background/20 rounded border border-white/5 cursor-text"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-sm text-white/60 truncate">
        {captionText || 'Add caption...'}
      </span>
      <Pencil className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
    </div>
  );
};

export default CaptionEditor;
