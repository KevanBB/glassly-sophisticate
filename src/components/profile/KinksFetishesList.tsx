import React, { KeyboardEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface KinksFetishesListProps {
  profile?: any; // Added profile prop
  userId: string;
  kinksFetishes: string[];
  editing: boolean;
  isOwnProfile?: boolean; // Added isOwnProfile prop
  onKinksUpdated: (updatedKinks: string[]) => void;
}

const KinksFetishesList = ({ profile, userId, kinksFetishes, editing, isOwnProfile, onKinksUpdated }: KinksFetishesListProps) => {
  const [newKink, setNewKink] = useState("");

  const handleKinkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKink(e.target.value);
  };

  const handleKinkInputKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      await addKink();
    }
  };

  const addKink = async () => {
    if (!newKink.trim()) return;
    
    const kinkToAdd = newKink.trim();
    
    try {
      // Add the kink to the user_kinks table
      const { error } = await supabase
        .from('user_kinks')
        .insert({
          user_id: userId,
          kink_name: kinkToAdd
        });
        
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          toast.error("This kink/fetish is already in your list");
        } else {
          throw error;
        }
      } else {
        // The trigger will update the profile's kinks_fetishes array automatically
        // But we'll update the local state for immediate UI feedback
        onKinksUpdated([...kinksFetishes, kinkToAdd]);
        toast.success("Kink/fetish added");
      }
    } catch (error: any) {
      toast.error(`Error adding kink/fetish: ${error.message}`);
    }
    
    setNewKink("");
  };

  const removeKink = async (kinkToRemove: string) => {
    try {
      const { error } = await supabase
        .from('user_kinks')
        .delete()
        .eq('user_id', userId)
        .eq('kink_name', kinkToRemove);
        
      if (error) throw error;
      
      // The trigger will update the profile's kinks_fetishes array automatically
      // But we'll update the local state for immediate UI feedback
      onKinksUpdated(kinksFetishes.filter(kink => kink !== kinkToRemove));
      
      toast.success("Kink/fetish removed");
    } catch (error: any) {
      toast.error(`Error removing kink/fetish: ${error.message}`);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-white/80">Kinks/Fetishes</Label>
      <div className="flex flex-wrap gap-2">
        {kinksFetishes.map((kink: string, index: number) => (
          <Badge key={index} variant="outline" className="bg-white/10 hover:bg-white/20 text-white">
            {kink}
            {editing && (
              <button 
                className="ml-1 text-white/60 hover:text-white"
                onClick={() => removeKink(kink)}
              >
                <X size={14} />
              </button>
            )}
          </Badge>
        ))}
      </div>
      
      {editing && (
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <Input
              value={newKink}
              onChange={handleKinkInputChange}
              onKeyDown={handleKinkInputKeyDown}
              placeholder="Type kink/fetish and press Enter or comma"
              className="bg-white/5 border-white/10 text-white pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/20 text-white"
            onClick={addKink}
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
      )}
      <p className="text-xs text-white/60 mt-1">
        Add individual kinks/fetishes separated by a comma
      </p>
    </div>
  );
};

export default KinksFetishesList;
