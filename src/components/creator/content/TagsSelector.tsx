
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface TagsSelectorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsSelector = ({ tags, onTagsChange }: TagsSelectorProps) => {
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      if (tags.length < 10) {
        const newTag = e.currentTarget.value.trim();
        if (newTag && !tags.includes(newTag)) {
          onTagsChange([...tags, newTag]);
          e.currentTarget.value = '';
        }
      } else {
        toast.error('Maximum of 10 tags allowed');
      }
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
      <div className="border border-white/10 rounded-md p-3 bg-background/50">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <div 
              key={index}
              className="bg-primary/80 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              <span>{tag}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeTag(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            onKeyDown={handleAddTag}
            className="bg-background/30 border-white/10"
          />
        </div>
        <p className="text-xs text-white/60 mt-2">Press Enter to add a tag (max 10)</p>
      </div>
    </div>
  );
};

export default TagsSelector;
