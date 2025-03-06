
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Lock, LayoutGrid } from 'lucide-react';
import { PostVisibility } from '../profile/types';

interface VisibilitySelectorProps {
  visibility: PostVisibility;
  price?: number;
  onVisibilityChange: (visibility: PostVisibility) => void;
  onPriceChange: (price: number | undefined) => void;
}

const VisibilitySelector = ({ 
  visibility, 
  price, 
  onVisibilityChange, 
  onPriceChange 
}: VisibilitySelectorProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Visibility</h3>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant={visibility === 'free' ? 'default' : 'outline'}
          className="justify-start"
          onClick={() => onVisibilityChange('free')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Free - Available to everyone
        </Button>
        <Button
          type="button"
          variant={visibility === 'subscriber' ? 'default' : 'outline'}
          className="justify-start"
          onClick={() => onVisibilityChange('subscriber')}
        >
          <Lock className="w-4 h-4 mr-2" />
          Subscribers Only
        </Button>
        <Button
          type="button"
          variant={visibility === 'ppv' ? 'default' : 'outline'}
          className="justify-start"
          onClick={() => onVisibilityChange('ppv')}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          Pay-Per-View
        </Button>
        
        {visibility === 'ppv' && (
          <div className="mt-2">
            <Input
              type="number"
              placeholder="Price ($)"
              value={price || ''}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              min="0.99"
              step="0.01"
              className="bg-background/50 border-white/10"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VisibilitySelector;
