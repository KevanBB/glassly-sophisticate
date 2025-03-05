
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Bell, User, MessageCircle, Search, DollarSign } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import NotificationCard from '@/components/dashboard/NotificationCard';
import ActivityCard from '@/components/dashboard/ActivityCard';
import MatchesCard from '@/components/dashboard/MatchesCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import TributeCard from '@/components/dashboard/TributeCard';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { toast } from 'sonner';

// Mock data - would come from API in production
const mockNotifications = [
  { id: 1, title: 'New match request', message: 'DomMaster97 sent you a match request', time: '2m ago', read: false },
  { id: 2, title: 'Message received', message: 'You have a new message from SubLover23', time: '1h ago', read: false },
  { id: 3, title: 'Profile view', message: 'Your profile was viewed by 3 people today', time: '3h ago', read: true },
];

const mockActivity = [
  { id: 1, type: 'login', message: 'Last login 2 hours ago', time: '2h ago' },
  { id: 2, type: 'message', message: 'Sent 5 messages today', time: '4h ago' },
  { id: 3, type: 'profile', message: 'Updated your preferences', time: '1d ago' },
];

const mockMatches = [
  { id: 1, name: 'DomMaster97', type: 'Dom', compatibility: 95, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'SubLover23', type: 'Sub', compatibility: 88, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'KinkExplorer', type: 'Switch', compatibility: 82, avatar: 'https://i.pravatar.cc/150?img=3' },
];

const quickActions = [
  { id: 1, title: 'Find Match', icon: 'Search', color: 'bg-brand' },
  { id: 2, title: 'Messages', icon: 'MessageCircle', color: 'bg-green-500' },
  { id: 3, title: 'Edit Profile', icon: 'User', color: 'bg-purple-500' },
  { id: 4, title: 'Preferences', icon: 'Settings', color: 'bg-amber-500' },
];

const recentTributes = [
  { id: 1, amount: 25, recipient: 'DomMaster97', date: '2 days ago', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, amount: 10, recipient: 'SubLover23', date: '1 week ago', avatar: 'https://i.pravatar.cc/150?img=2' },
];

const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [backgroundClass, setBackgroundClass] = useState('from-dark-200 to-dark');
  const [showTributeForm, setShowTributeForm] = useState(false);
  
  // Update time and background based on time of day
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      
      const hour = newTime.getHours();
      if (hour >= 6 && hour < 12) {
        setBackgroundClass('from-brand-light/20 to-dark');
      } else if (hour >= 12 && hour < 18) {
        setBackgroundClass('from-brand/20 to-dark');
      } else {
        setBackgroundClass('from-dark-200 to-dark');
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // FAB actions
  const handleFabClick = () => {
    setShowTributeForm(true);
    toast('Quick tribute activated', {
      description: 'Send a tribute to your favorite domme',
    });
  };

  const fabSubActions = [
    { 
      icon: <DollarSign size={16} />, 
      label: 'Quick $20 Tribute', 
      color: 'text-white', 
      onClick: () => {
        toast.success('Quick $20 tribute sent!');
      }
    },
    { 
      icon: <DollarSign size={16} />, 
      label: 'Custom Tribute', 
      color: 'text-white', 
      onClick: () => setShowTributeForm(true)
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-6 overflow-x-hidden"
    >
      {/* Dynamic background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundClass} -z-10`}>
        {/* Animated gradient orbs for background effect */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-brand-light/5 blur-3xl opacity-20 animate-float animate-delay-500"></div>
      </div>
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGZpbHRlciBpZD0ibm9pc2UiPgogICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIG51bU9jdGF2ZXM9IjIiIHNlZWQ9IjAiIHJlc3VsdD0idHVyYnVsZW5jZSIgLz4KICAgIDxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiIC8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-soft-light pointer-events-none -z-10"></div>
      
      {/* Main dashboard content */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-white/60">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand"
        >
          <img src="https://i.pravatar.cc/150?img=12" alt="User avatar" className="w-full h-full object-cover" />
        </motion.div>
      </header>
      
      {/* Dashboard grid layout */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-2"
        >
          <QuickActionsCard actions={quickActions} />
        </motion.div>
        
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NotificationCard notifications={mockNotifications} />
        </motion.div>
        
        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ActivityCard activities={mockActivity} />
        </motion.div>
        
        {/* Tributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TributeCard recentTributes={recentTributes} />
        </motion.div>
        
        {/* Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-1 md:col-span-2"
        >
          <MatchesCard matches={mockMatches} />
        </motion.div>
      </main>
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={<DollarSign size={24} />}
        onClick={handleFabClick}
        position="bottom-right"
        subActions={fabSubActions}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </motion.div>
  );
};

export default Dashboard;
