
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserProfile(user: any) {
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          setProfile(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    
    fetchProfile();
  }, [user]);

  return profile;
}
