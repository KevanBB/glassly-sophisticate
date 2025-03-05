
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import CommunityActiveUsers from '@/components/community/CommunityActiveUsers';
import CommunitySearch from '@/components/community/CommunitySearch';

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    activityStatus: 'all',
    joinDate: 'newest',
    role: 'all',
    sort: 'recent'
  });

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
      <div className="w-full max-w-6xl z-10 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Community Hub</h1>
        <p className="text-white/70">Connect with other members of the community</p>
      </div>
      
      {/* Search and filters */}
      <CommunitySearch 
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      {/* Active users section */}
      <CommunityActiveUsers 
        searchQuery={searchQuery}
        filters={activeFilters}
      />
      
      <BottomNavigation />
    </motion.div>
  );
};

export default CommunityPage;
