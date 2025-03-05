
import React, { useState, useEffect } from 'react';
import { Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BasicProfileInfo from './BasicProfileInfo';
import RolePreferences from './RolePreferences';
import KinksFetishesList from './KinksFetishesList';
import PersonaSelector from './PersonaSelector';
import LocationInfo from './LocationInfo';
import SocialLinks from './SocialLinks';

interface AboutTabProps {
  profile: any;
  user: any;
  isEditing: boolean;
  onSave: () => void;
}

const AboutTab = ({ profile, user, isEditing, onSave }: AboutTabProps) => {
  const [currentPersona, setCurrentPersona] = useState("default");
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || "",
    bio: profile?.bio || "",
    role: profile?.role || "switch",
    kinksFetishes: profile?.kinks_fetishes || [],
    experienceLevel: profile?.experience_level || "curious",
    avatarUrl: profile?.avatar_url || "",
    location: profile?.location || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    orientation: profile?.orientation || "",
    lookingFor: profile?.looking_for || [],
  });
  
  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.display_name || "",
        bio: profile.bio || "",
        role: profile.role || "switch",
        kinksFetishes: profile.kinks_fetishes || [],
        experienceLevel: profile.experience_level || "curious",
        avatarUrl: profile.avatar_url || "",
        location: profile.location || "",
        age: profile.age || "",
        gender: profile.gender || "",
        orientation: profile.orientation || "",
        lookingFor: profile.looking_for || [],
      });
    }
  }, [profile]);
  
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
  
  const handleAvatarUpdate = (url: string) => {
    setFormData({
      ...formData,
      avatarUrl: url
    });
  };
  
  const handleLookingForChange = (lookingFor: string[]) => {
    setFormData({
      ...formData,
      lookingFor
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
          experience_level: formData.experienceLevel,
          location: formData.location,
          age: formData.age,
          gender: formData.gender,
          orientation: formData.orientation,
          looking_for: formData.lookingFor
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      onSave();
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Profile Information</h2>
        
        {isEditing ? (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleSave}
            className="text-white/80 hover:text-white"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        ) : null}
      </div>
      
      <div className="flex flex-col space-y-6">
        {/* Basic Information */}
        <BasicProfileInfo 
          profile={profile} 
          editing={isEditing} 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        {/* Location & Demographics */}
        <LocationInfo
          editing={isEditing}
          formData={formData}
          handleChange={handleChange}
        />
        
        {/* Role Information */}
        <GlassPanel className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Role & Preferences</h3>
            {!isEditing && formData.role && (
              <div className="px-3 py-1 rounded-full bg-primary/20 text-white text-sm">
                {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </div>
            )}
          </div>
          <Separator className="bg-white/10" />
          
          <RolePreferences 
            role={formData.role}
            experienceLevel={formData.experienceLevel}
            editing={isEditing}
            onRoleChange={handleRoleChange}
            onExperienceLevelChange={handleExperienceLevelChange}
          />
          
          <KinksFetishesList 
            userId={user.id}
            kinksFetishes={formData.kinksFetishes}
            editing={isEditing}
            onKinksUpdated={handleKinksUpdated}
          />
        </GlassPanel>
        
        {/* Social Links */}
        <SocialLinks
          editing={isEditing}
          userId={user.id}
        />
        
        {/* Multiple Personas */}
        <PersonaSelector 
          currentPersona={currentPersona}
          editing={isEditing}
          onPersonaChange={setCurrentPersona}
        />
      </div>
    </div>
  );
};

export default AboutTab;
