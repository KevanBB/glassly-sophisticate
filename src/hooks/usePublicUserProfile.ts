
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, PrivacySettings } from './useUserProfile';

export function usePublicUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch profile data by user ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Could not load this profile');
          toast.error('Error loading profile');
          setLoading(false);
          return;
        }
        
        // Fetch privacy settings to determine what can be displayed
        const { data: privacyData } = await supabase
          .from('privacy_settings')
          .select('*')
          .eq('user_id', profileData.id)
          .maybeSingle();
        
        // Create default privacy settings with proper types if none exist
        const defaultPrivacySettings: PrivacySettings = {
          user_id: profileData.id,
          display_name_visibility: 'public',
          role_visibility: 'public',
          interests_visibility: 'public',
          experience_visibility: 'public', 
          bio_visibility: 'public',
          photos_visibility: 'public'
        };
        
        // Ensure values are properly typed as union types
        const typedPrivacySettings: PrivacySettings = privacyData 
          ? {
              ...defaultPrivacySettings,
              ...privacyData,
              // Force type casting to ensure correct union types
              display_name_visibility: (privacyData.display_name_visibility as 'public' | 'friends' | 'private') || 'public',
              role_visibility: (privacyData.role_visibility as 'public' | 'friends' | 'private') || 'public',
              interests_visibility: (privacyData.interests_visibility as 'public' | 'friends' | 'private') || 'public',
              experience_visibility: (privacyData.experience_visibility as 'public' | 'friends' | 'private') || 'public',
              bio_visibility: (privacyData.bio_visibility as 'public' | 'friends' | 'private') || 'public',
              photos_visibility: (privacyData.photos_visibility as 'public' | 'friends' | 'private') || 'public',
              user_id: profileData.id
            }
          : defaultPrivacySettings;
        
        // Set up the profile with privacy settings
        setProfile({
          ...profileData,
          privacy_settings: typedPrivacySettings
        });
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
        toast.error('Could not load profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}
