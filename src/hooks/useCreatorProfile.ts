
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, PrivacySettings } from './useUserProfile';

export function useCreatorProfile(username: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // First, find the user ID by their creator_username
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('creator_username', username)
          .single();
        
        if (userError) {
          console.error('Error fetching creator profile:', userError);
          setError('Creator not found');
          setLoading(false);
          return;
        }
        
        // Fetch privacy settings
        const { data: privacyData } = await supabase
          .from('privacy_settings')
          .select('*')
          .eq('user_id', userData.id)
          .maybeSingle();
        
        // Create default privacy settings with proper types if none exist
        const defaultPrivacySettings: PrivacySettings = {
          user_id: userData.id,
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
              user_id: userData.id
            }
          : defaultPrivacySettings;
        
        // Set up the profile with privacy settings
        setProfile({
          ...userData,
          privacy_settings: typedPrivacySettings
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load creator profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [username]);

  return { profile, loading, error };
}
