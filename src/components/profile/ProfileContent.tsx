
import React, { useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProfileAvatar from './ProfileAvatar';
import BasicProfileInfo from './BasicProfileInfo';
import RolePreferences from './RolePreferences';
import KinksFetishesList from './KinksFetishesList';
import PersonaSelector from './PersonaSelector';

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
    kinksFetishes: profile?.kinks_fetishes || [],
    experienceLevel: profile?.experience_level || "curious",
  });
  
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

  const handleKinksUpdated = (updatedKinks: string[]) => {
    setFormData({
      ...formData,
      kinksFetishes: updatedKinks
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
          kinks_fetishes: formData.kinksFetishes,
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
        <ProfileAvatar 
          avatarUrl={profile?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
          editing={editing} 
        />
        
        {/* Basic Information */}
        <BasicProfileInfo 
          profile={profile} 
          editing={editing} 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        {/* Role Information */}
        <GlassPanel className="p-4 space-y-4">
          <h3 className="text-lg font-medium text-white">Role & Preferences</h3>
          <Separator className="bg-white/10" />
          
          <RolePreferences 
            role={formData.role}
            experienceLevel={formData.experienceLevel}
            editing={editing}
            onRoleChange={handleRoleChange}
            onExperienceLevelChange={handleExperienceLevelChange}
          />
          
          <KinksFetishesList 
            userId={user.id}
            kinksFetishes={formData.kinksFetishes}
            editing={editing}
            onKinksUpdated={handleKinksUpdated}
          />
        </GlassPanel>
        
        {/* Multiple Personas */}
        <PersonaSelector 
          currentPersona={currentPersona}
          editing={editing}
          onPersonaChange={setCurrentPersona}
        />
      </div>
    </div>
  );
};

export default ProfileContent;
