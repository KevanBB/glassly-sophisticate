
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './useUserProfile';

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
        
        // Set up the profile with privacy settings
        setProfile({
          ...userData,
          privacy_settings: privacyData || undefined
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
