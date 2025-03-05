
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import GlassPanel from '@/components/ui/GlassPanel';
import { User, Mail, FileText } from 'lucide-react';

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
    <GlassPanel className="p-6 space-y-4">
      <h3 className="text-lg font-medium text-white">Basic Information</h3>
      
      {!editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Name</p>
                <p className="text-white font-medium">{profile?.first_name} {profile?.last_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Display Name</p>
                <p className="text-white font-medium">{formData.displayName || "Not set"}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 pt-2">
            <div className="bg-primary/20 p-2 rounded-full mt-1">
              <FileText size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/60 mb-1">Bio</p>
              <p className="text-white">{formData.bio || "No bio yet"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
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
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
              placeholder="Tell others about yourself..."
            />
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

export default BasicProfileInfo;
