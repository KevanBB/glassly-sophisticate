
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Bell, User, MessageCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

const BottomNavigation = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([
    { icon: <Home size={24} />, label: "Home", path: "/dashboard", active: true },
    { icon: <MessageCircle size={24} />, label: "Messages", path: "/messages", active: false },
    { icon: <Search size={24} />, label: "Explore", path: "/explore", active: false },
    { icon: <Bell size={24} />, label: "Alerts", path: "/notifications", active: false },
    { icon: <User size={24} />, label: "Profile", path: "/profile", active: false },
  ]);

  const handleNavClick = (index: number) => {
    setNavItems(navItems.map((item, i) => ({
      ...item,
      active: i === index
    })));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <GlassNavigation>
        <div className="flex justify-around items-center w-full max-w-md mx-auto px-4 py-2">
          {navItems.map((item, index) => (
            <NavButton 
              key={index}
              item={item}
              onClick={() => handleNavClick(index)}
            />
          ))}
        </div>
      </GlassNavigation>
    </motion.div>
  );
};

// Glass navigation container
const GlassNavigation = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-glass-10 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
    {children}
  </div>
);

// Individual nav button
const NavButton = ({ item, onClick }: { item: NavItem, onClick: () => void }) => (
  <Link
    to={item.path}
    className="flex flex-col items-center justify-center py-2 px-3"
    onClick={onClick}
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative ${item.active ? 'text-brand' : 'text-white/60'} transition-colors duration-300`}
    >
      {/* Subtle glow effect when active */}
      {item.active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1.2 }}
          className="absolute inset-0 bg-brand rounded-full blur-md -z-10"
        />
      )}
      {item.icon}
      <span className="text-xs mt-1">{item.label}</span>
    </motion.div>
  </Link>
);

export default BottomNavigation;
