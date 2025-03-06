
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);
  
  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }
      
      setIsAdmin(data.role === 'admin');
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
    }
  };
  
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };
  
  const baseNavItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  // Add admin link if user is an admin
  const navItems = isAdmin 
    ? [...baseNavItems, { path: '/admin', icon: Shield, label: 'Admin' }]
    : baseNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-glass-10 backdrop-blur-md border-t border-white/10 py-2">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 text-white/70 hover:text-white transition-colors",
                isActive(item.path) && "text-primary"
              )}
            >
              <item.icon size={22} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
