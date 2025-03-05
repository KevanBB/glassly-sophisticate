
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoleColors } from '@/hooks/useRoleColors';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileContentProps {
  profile: any;
  user: any;
}

const ProfileContent = ({ profile, user }: ProfileContentProps) => {
  const [currentPersona, setCurrentPersona] = useState("default");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || "",
    bio: profile?.bio || "",
    role: profile?.role || "switch",
    interests: profile?.interests || [],
    experienceLevel: profile?.experience_level || "curious",
  });
  
  const { getRoleColor } = useRoleColors();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
  };
  
  const handleExperienceLevelChange = (value: string) => {
    setFormData({
      ...formData,
      experienceLevel: value
    });
  };
  
  const handleSave = async () => {
    try {
      // If we had profiles with personas, we would save the current persona data
      // For now, just update the profile
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          role: formData.role,
          interests: formData.interests,
          experience_level: formData.experienceLevel
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Profile Information</h2>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="text-white/80 hover:text-white"
        >
          {editing ? <Save size={16} className="mr-2" /> : <Edit2 size={16} className="mr-2" />}
          {editing ? "Save" : "Edit"}
        </Button>
      </div>
      
      <div className="flex flex-col space-y-6">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-brand">
              <img 
                src={profile?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="Profile avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            {editing && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-0 right-0 bg-brand/80 hover:bg-brand text-white rounded-full w-8 h-8"
              >
                <Edit2 size={14} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Basic Information */}
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
        
        {/* Role Information */}
        <GlassPanel className="p-4 space-y-4">
          <h3 className="text-lg font-medium text-white">Role & Preferences</h3>
          <Separator className="bg-white/10" />
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white/80">Primary Role</Label>
            <Select 
              disabled={!editing}
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dominant">Dominant</SelectItem>
                <SelectItem value="submissive">Submissive</SelectItem>
                <SelectItem value="switch">Switch</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-2">
              <Badge className={`${getRoleColor(formData.role)} text-white`}>
                {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experienceLevel" className="text-white/80">Experience Level</Label>
            <Select 
              disabled={!editing}
              value={formData.experienceLevel}
              onValueChange={handleExperienceLevelChange}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curious">Curious</SelectItem>
                <SelectItem value="novice">Novice</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="experienced">Experienced</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Interests</Label>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-white/10 hover:bg-white/20 text-white">
                  {interest}
                  {editing && (
                    <button className="ml-1 text-white/60 hover:text-white">×</button>
                  )}
                </Badge>
              ))}
              {editing && (
                <Button variant="outline" size="sm" className="border-dashed border-white/20 text-white/60">
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              )}
            </div>
          </div>
        </GlassPanel>
        
        {/* Multiple Personas */}
        <GlassPanel className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Personas</h3>
            {editing && (
              <Button variant="outline" size="sm" className="border-white/20 text-white">
                <Plus size={14} className="mr-1" /> Create Persona
              </Button>
            )}
          </div>
          <Separator className="bg-white/10" />
          
          <div className="grid grid-cols-2 gap-4">
            <GlassPanel 
              intensity="light"
              className={`p-3 cursor-pointer ${currentPersona === "default" ? "border-brand" : ""}`}
              onClick={() => setCurrentPersona("default")}
            >
              <div className="flex items-center space-x-3">
                <User size={18} className="text-white/70" />
                <div>
                  <p className="text-sm font-medium text-white">Default</p>
                  <p className="text-xs text-white/60">Primary Persona</p>
                </div>
              </div>
            </GlassPanel>
            
            <GlassPanel 
              intensity="light"
              className={`p-3 cursor-pointer ${currentPersona === "public" ? "border-brand" : ""}`}
              onClick={() => setCurrentPersona("public")}
            >
              <div className="flex items-center space-x-3">
                <User size={18} className="text-white/70" />
                <div>
                  <p className="text-sm font-medium text-white">Public</p>
                  <p className="text-xs text-white/60">Limited Visibility</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default ProfileContent;
