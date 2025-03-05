import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
  profile: any;
  user: any;
}

const UserMenu = ({ profile, user }: UserMenuProps) => {
  const { signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('You have been logged out');
  };

  const navigateTo = (path: string) => {
    toast.info(`Navigating to ${path}`);
    // Actual navigation would go here
  };

  return (
    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <PopoverTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand cursor-pointer mr-4 hover:ring-2 hover:ring-brand/70 focus:outline-none transition-all"
          title="User menu"
        >
          <img src="https://i.pravatar.cc/150?img=12" alt="User avatar" className="w-full h-full object-cover" />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-56 z-50 bg-dark-200 border border-white/10 shadow-xl rounded-lg p-1">
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white">{profile?.first_name} {profile?.last_name}</p>
            <p className="text-xs text-white/60">{user?.email}</p>
          </div>
          <div className="py-1">
            <button 
              onClick={() => navigateTo('/profile')} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-brand/20 rounded-md transition-colors"
            >
              <User size={16} className="mr-2" />
              Profile
            </button>
            <button 
              onClick={() => navigateTo('/settings')} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-brand/20 rounded-md transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
            <button 
              onClick={() => navigateTo('/subscription')} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-brand/20 rounded-md transition-colors"
            >
              <CreditCard size={16} className="mr-2" />
              Subscription
            </button>
          </div>
          <div className="py-1 border-t border-white/10">
            <button 
              onClick={handleSignOut} 
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-brand/20 rounded-md transition-colors"
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
