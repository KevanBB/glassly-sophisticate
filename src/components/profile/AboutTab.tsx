
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BasicProfileInfo from './BasicProfileInfo';
import LocationInfo from './LocationInfo';
import RolePreferences from './RolePreferences';
import KinksFetishesList from './KinksFetishesList';
import SocialLinks from './SocialLinks';

interface AboutTabProps {
  profile: any;
  user: any;
  isEditing: boolean;
  isOwnProfile?: boolean;
  onSave?: () => void;
}

const AboutTab = ({ profile, user, isEditing, isOwnProfile = true, onSave }: AboutTabProps) => {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    age: '',
    gender: '',
    orientation: '',
    location: '',
    lookingFor: [] as string[],
    role: '',
    experienceLevel: ''
  });
  
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.display_name || '',
        bio: profile.bio || '',
        age: profile.age || '',
        gender: profile.gender || '',
        orientation: profile.orientation || '',
        location: profile.location || '',
        lookingFor: profile.looking_for || [],
        role: profile.role || 'switch',
        experienceLevel: profile.experience_level || 'curious'
      });
    }
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };
  
  const handleExperienceLevelChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      experienceLevel: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      if (!profile || !profile.id) {
        toast.error('Unable to update profile: no profile found');
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          age: formData.age,
          gender: formData.gender,
          orientation: formData.orientation,
          location: formData.location,
          looking_for: formData.lookingFor,
          role: formData.role,
          experience_level: formData.experienceLevel
        })
        .eq('id', profile.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error(`Error updating profile: ${error.message}`);
        return;
      }
      
      toast.success('Profile updated successfully');
      if (onSave) onSave();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Check privacy settings for each section
  const canViewBio = isOwnProfile || 
    (profile?.privacy_settings?.bio_visibility === 'public') || 
    (profile?.privacy_settings?.bio_visibility === 'friends' /* && isFriend logic would go here */);
    
  const canViewRole = isOwnProfile || 
    (profile?.privacy_settings?.role_visibility === 'public') || 
    (profile?.privacy_settings?.role_visibility === 'friends' /* && isFriend logic would go here */);
    
  const canViewInterests = isOwnProfile || 
    (profile?.privacy_settings?.interests_visibility === 'public') || 
    (profile?.privacy_settings?.interests_visibility === 'friends' /* && isFriend logic would go here */);
    
  const canViewExperience = isOwnProfile || 
    (profile?.privacy_settings?.experience_visibility === 'public') || 
    (profile?.privacy_settings?.experience_visibility === 'friends' /* && isFriend logic would go here */);
  
  return (
    <div className="space-y-6">
      <BasicProfileInfo 
        profile={profile} 
        editing={isEditing} 
        formData={formData} 
        handleChange={handleChange}
        isOwnProfile={isOwnProfile}
      />
      
      {(isOwnProfile || canViewBio) && (
        <LocationInfo 
          profile={profile} 
          editing={isEditing} 
          formData={formData} 
          handleChange={handleChange}
        />
      )}
      
      {(isOwnProfile || canViewRole) && (
        <RolePreferences 
          profile={profile} 
          role={formData.role}
          experienceLevel={formData.experienceLevel}
          editing={isEditing} 
          onRoleChange={handleRoleChange}
          onExperienceLevelChange={handleExperienceLevelChange}
        />
      )}
      
      {(isOwnProfile || canViewInterests) && (
        <KinksFetishesList 
          profile={profile} 
          userId={user?.id || ''}
          kinksFetishes={profile?.kinks_fetishes || []}
          editing={isEditing} 
          isOwnProfile={isOwnProfile}
          onKinksUpdated={(updatedKinks) => {
            // This is a placeholder for the actual implementation
            console.log('Kinks updated:', updatedKinks);
          }}
        />
      )}
      
      {isOwnProfile && (
        <SocialLinks 
          profile={profile} 
          editing={isEditing} 
          userId={user?.id || ''}
        />
      )}
      
      {isEditing && isOwnProfile && (
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Save Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default AboutTab;
