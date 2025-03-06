
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PrivacySettings {
  id?: string;
  user_id: string; // Required
  display_name_visibility?: 'public' | 'friends' | 'private';
  role_visibility?: 'public' | 'friends' | 'private';
  interests_visibility?: 'public' | 'friends' | 'private';
  experience_visibility?: 'public' | 'friends' | 'private';
  bio_visibility?: 'public' | 'friends' | 'private';
  photos_visibility?: 'public' | 'friends' | 'private';
  hide_from_search?: boolean;
  incognito_mode?: boolean;
  prevent_screenshots?: boolean;
  disable_message_history?: boolean;
}

export interface UserProfile {
  id: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  role?: string;
  kinks_fetishes?: string[];
  experience_level?: string;
  is_active?: boolean;
  joined_at?: string;
  last_active?: string;
  updated_at?: string;
  location?: string;
  age?: string;
  gender?: string;
  orientation?: string;
  looking_for?: string[];
  privacy_settings?: PrivacySettings;
}

export function useUserProfile(user: any) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          // Update the user's activity status when they load their profile
          const now = new Date().toISOString();
          await supabase
            .from('profiles')
            .update({ 
              last_active: now,
              is_active: true 
            })
            .eq('id', user.id);
            
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          // Fetch privacy settings
          const { data: privacyData, error: privacyError } = await supabase
            .from('privacy_settings')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (privacyError && privacyError.code !== 'PGRST116') { // Not found is ok
            console.error('Error fetching privacy settings:', privacyError);
          }
          
          // If there are no privacy settings yet, create default ones
          let finalPrivacyData = privacyData;
          if (!privacyData) {
            const defaultPrivacySettings = {
              user_id: user.id,
              display_name_visibility: 'public',
              role_visibility: 'friends',
              interests_visibility: 'friends',
              experience_visibility: 'private',
              bio_visibility: 'friends',
              photos_visibility: 'private',
              hide_from_search: false,
              incognito_mode: false,
              prevent_screenshots: true,
              disable_message_history: false
            };
            
            const { data: newSettings, error: insertError } = await supabase
              .from('privacy_settings')
              .insert(defaultPrivacySettings)
              .select()
              .single();
              
            if (insertError) {
              console.error('Error creating default privacy settings:', insertError);
            } else {
              finalPrivacyData = newSettings;
            }
          }
          
          // Ensure privacy settings are properly typed
          const typedPrivacySettings: PrivacySettings | undefined = finalPrivacyData ? {
            ...finalPrivacyData,
            user_id: finalPrivacyData.user_id, // Ensure user_id exists
            display_name_visibility: finalPrivacyData.display_name_visibility as 'public' | 'friends' | 'private',
            role_visibility: finalPrivacyData.role_visibility as 'public' | 'friends' | 'private',
            interests_visibility: finalPrivacyData.interests_visibility as 'public' | 'friends' | 'private',
            experience_visibility: finalPrivacyData.experience_visibility as 'public' | 'friends' | 'private',
            bio_visibility: finalPrivacyData.bio_visibility as 'public' | 'friends' | 'private',
            photos_visibility: finalPrivacyData.photos_visibility as 'public' | 'friends' | 'private',
          } : undefined;
          
          // Combine profile and privacy data
          setProfile({
            ...profileData,
            privacy_settings: typedPrivacySettings
          });
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    
    fetchProfile();
    
    // Set up a periodic refresh of the profile data to ensure we have the latest activity status
    const refreshInterval = setInterval(fetchProfile, 60000); // Refresh every minute
    
    // Set up realtime subscription for profile updates
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user?.id}` },
        (payload) => {
          // Update profile with realtime changes
          if (profile) {
            setProfile(prev => prev ? { ...prev, ...payload.new } : null);
          }
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(profileSubscription);
    };
  }, [user]);

  return profile;
}
