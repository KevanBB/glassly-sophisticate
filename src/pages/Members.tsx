
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import CommunitySearch from '@/components/community/CommunitySearch';
import MembersList from '@/components/community/MembersList';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const MembersPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    activityStatus: 'all',
    joinDate: 'newest',
    role: 'all',
    sort: 'recent'
  });

  // User activity tracking - update on page load and at intervals
  useEffect(() => {
    if (!user) return;

    // Update user's activity status when they visit the members page
    const updateActivity = async () => {
      try {
        const now = new Date().toISOString();
        await supabase
          .from('profiles')
          .update({ 
            last_active: now,
            is_active: true 
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating activity status:', error);
      }
    };

    // Update activity on page load
    updateActivity();

    // Set up periodic activity updates
    const activityInterval = setInterval(updateActivity, 60000); // Every minute

    // Cleanup function
    return () => {
      clearInterval(activityInterval);
    };
  }, [user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      activityStatus: 'all',
      joinDate: 'newest',
      role: 'all',
      sort: 'recent'
    });
    setSearchQuery('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center px-4 py-6 pb-20 overflow-x-hidden"
    >
      {/* Background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-200 to-dark z-0" />
      
      {/* Page header */}
      <div className="w-full max-w-6xl z-10 mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <Link to="/community">
            <Button variant="link" className="text-white/70 pl-0 -ml-3 hover:text-white/90">
              <ArrowLeft size={16} className="mr-1" />
              Back to Community Hub
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Member Directory</h1>
        </div>
      </div>
      
      {/* Search and filters */}
      <CommunitySearch 
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      {/* Members list */}
      <MembersList 
        searchQuery={searchQuery}
        filters={activeFilters}
      />
      
      <BottomNavigation />
    </motion.div>
  );
};

export default MembersPage;
