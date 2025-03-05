
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import CommunitySearch from '@/components/community/CommunitySearch';
import MembersList from '@/components/community/MembersList';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MembersPage = () => {
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
