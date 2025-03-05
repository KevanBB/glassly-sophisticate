
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import GlassPanel from '@/components/ui/GlassPanel';

interface BasicProfileInfoProps {
  profile: any;
  editing: boolean;
  formData: {
    displayName: string;
    bio: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicProfileInfo = ({ profile, editing, formData, handleChange }: BasicProfileInfoProps) => {
  return (
    <GlassPanel className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white/80">First Name</Label>
          <Input 
            id="firstName" 
            value={profile?.first_name || ""} 
            disabled 
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
          <Input 
            id="lastName" 
            value={profile?.last_name || ""} 
            disabled 
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-white/80">Display Name</Label>
        <Input 
          id="displayName" 
          name="displayName"
          value={formData.displayName} 
          onChange={handleChange}
          disabled={!editing}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white/80">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio"
          value={formData.bio} 
          onChange={handleChange}
          disabled={!editing}
          className="bg-white/5 border-white/10 text-white min-h-[100px]"
        />
      </div>
    </GlassPanel>
  );
};

export default BasicProfileInfo;
