
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './useUserProfile';

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
        // Fetch profile data
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
          .eq('user_id', userId)
          .maybeSingle();
        
        // Set up the profile with privacy settings
        setProfile({
          ...profileData,
          privacy_settings: privacyData || {
            user_id: userId,
            display_name_visibility: 'public',
            role_visibility: 'public',
            interests_visibility: 'public',
            experience_visibility: 'public',
            bio_visibility: 'public',
            photos_visibility: 'public'
          }
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
