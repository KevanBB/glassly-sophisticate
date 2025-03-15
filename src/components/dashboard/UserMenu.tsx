
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, LogOut, Shield } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserMenuProps {
  profile: any;
  user: any;
}

const UserMenu = ({ profile, user }: UserMenuProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.role === 'admin');
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('You have been logged out');
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
  };

  const navigateToProfile = () => {
    if (profile?.username) {
      navigateTo(`/profile/${profile.username}`);
    } else {
      navigateTo('/profile/setup');
    }
  };

  return (
    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <PopoverTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary cursor-pointer mr-4 hover:ring-2 hover:ring-primary/70 focus:outline-none transition-all"
          title="User menu"
        >
          <img 
            src={profile?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
            alt="User avatar" 
            className="w-full h-full object-cover" 
          />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-56 z-50 bg-dark-200 border border-white/10 shadow-xl rounded-lg p-1">
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white">{profile?.display_name || profile?.username}</p>
            <p className="text-xs text-white/60">{user?.email}</p>
            {profile?.user_number && (
              <span className="inline-block mt-1 bg-primary/20 text-white text-xs px-2 py-0.5 rounded-full">
                Member #{profile.user_number}
              </span>
            )}
            {isAdmin && (
              <span className="inline-block mt-1 ml-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <div className="py-1">
            <button 
              onClick={navigateToProfile} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md transition-colors"
            >
              <User size={16} className="mr-2" />
              Profile
            </button>
            <button 
              onClick={() => navigateTo('/settings')} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
            <button 
              onClick={() => navigateTo('/subscription')} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md transition-colors"
            >
              <CreditCard size={16} className="mr-2" />
              Subscription
            </button>
            {isAdmin && (
              <button 
                onClick={() => navigateTo('/admin')} 
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md transition-colors"
              >
                <Shield size={16} className="mr-2" />
                Admin Dashboard
              </button>
            )}
          </div>
          <div className="py-1 border-t border-white/10">
            <button 
              onClick={handleSignOut} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-primary/20 rounded-md transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
