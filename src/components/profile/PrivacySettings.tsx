
import React, { useState } from 'react';
import { Eye, EyeOff, Users, Lock, Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PrivacySettingsProps {
  profile: any;
  user: any;
}

type VisibilityOption = 'public' | 'friends' | 'private';
type ProfileElement = 'displayName' | 'role' | 'interests' | 'experience' | 'bio' | 'photos';

const PrivacySettings = ({ profile, user }: PrivacySettingsProps) => {
  const [privacySettings, setPrivacySettings] = useState({
    displayName: 'public' as VisibilityOption,
    role: 'friends' as VisibilityOption,
    interests: 'friends' as VisibilityOption,
    experience: 'private' as VisibilityOption,
    bio: 'friends' as VisibilityOption,
    photos: 'private' as VisibilityOption,
  });
  
  const [advancedSettings, setAdvancedSettings] = useState({
    hideFromSearch: false,
    incognitoMode: false,
    preventScreenshots: true,
    disableMessageHistory: false,
  });
  
  const handleVisibilityChange = (element: ProfileElement, value: VisibilityOption) => {
    setPrivacySettings({
      ...privacySettings,
      [element]: value
    });
  };
  
  const handleToggleChange = (setting: string, value: boolean) => {
    setAdvancedSettings({
      ...advancedSettings,
      [setting]: value
    });
  };
  
  const savePrivacySettings = () => {
    // This would normally save to the database
    toast.success("Privacy settings updated successfully!");
  };
  
  const getVisibilityIcon = (visibility: VisibilityOption) => {
    switch (visibility) {
      case 'public': return <Eye size={16} className="text-white/70" />;
      case 'friends': return <Users size={16} className="text-white/70" />;
      case 'private': return <Lock size={16} className="text-white/70" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Privacy Settings</h2>
        <Button 
          onClick={savePrivacySettings}
          className="bg-brand hover:bg-brand/90 text-white"
        >
          Save Changes
        </Button>
      </div>
      
      {/* Element Visibility */}
      <GlassPanel className="p-4 space-y-4">
        <h3 className="text-lg font-medium text-white">Profile Element Visibility</h3>
        <Separator className="bg-white/10" />
        
        <p className="text-sm text-white/70">
          Control who can see different elements of your profile. Each element can be set to Public (everyone), 
          Friends Only, or Private (only you).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-white/80">Display Name</Label>
            <Select 
              value={privacySettings.displayName}
              onValueChange={(value) => handleVisibilityChange('displayName', value as VisibilityOption)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Role Preference</Label>
            <Select 
              value={privacySettings.role}
              onValueChange={(value) => handleVisibilityChange('role', value as VisibilityOption)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Interests</Label>
            <Select 
              value={privacySettings.interests}
              onValueChange={(value) => handleVisibilityChange('interests', value as VisibilityOption)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Experience Level</Label>
            <Select 
              value={privacySettings.experience}
              onValueChange={(value) => handleVisibilityChange('experience', value as VisibilityOption)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Bio</Label>
            <Select 
              value={privacySettings.bio}
              onValueChange={(value) => handleVisibilityChange('bio', value as VisibilityOption)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Photos</Label>
            <Select 
              value={privacySettings.photos}
              onValueChange={(value) => handleVisibilityChange('photos', value as VisibilityOption)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Friends Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassPanel>
      
      {/* Advanced Privacy */}
      <GlassPanel className="p-4 space-y-4">
        <h3 className="text-lg font-medium text-white">Advanced Privacy</h3>
        <Separator className="bg-white/10" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Hide from Search Results</Label>
              <p className="text-xs text-white/60">Your profile won't appear in search results</p>
            </div>
            <Switch 
              checked={advancedSettings.hideFromSearch}
              onCheckedChange={(checked) => handleToggleChange('hideFromSearch', checked)}
            />
          </div>
          
          <Separator className="bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Incognito Mode</Label>
              <p className="text-xs text-white/60">Browse without showing your online status</p>
            </div>
            <Switch 
              checked={advancedSettings.incognitoMode}
              onCheckedChange={(checked) => handleToggleChange('incognitoMode', checked)}
            />
          </div>
          
          <Separator className="bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Prevent Screenshots</Label>
              <p className="text-xs text-white/60">Try to prevent others from taking screenshots</p>
            </div>
            <Switch 
              checked={advancedSettings.preventScreenshots}
              onCheckedChange={(checked) => handleToggleChange('preventScreenshots', checked)}
            />
          </div>
          
          <Separator className="bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Disable Message History</Label>
              <p className="text-xs text-white/60">Don't store message history on your device</p>
            </div>
            <Switch 
              checked={advancedSettings.disableMessageHistory}
              onCheckedChange={(checked) => handleToggleChange('disableMessageHistory', checked)}
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default PrivacySettings;
