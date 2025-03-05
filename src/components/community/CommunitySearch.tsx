
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  X,
  Clock,
  Calendar,
  User,
  SortAsc,
  SortDesc,
  Users
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlassPanel from '@/components/ui/GlassPanel';

interface CommunitySearchProps {
  searchQuery: string;
  activeFilters: {
    activityStatus: string;
    joinDate: string;
    role: string;
    sort: string;
  };
  onSearch: (query: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

const CommunitySearch = ({ 
  searchQuery, 
  activeFilters, 
  onSearch, 
  onFilterChange, 
  onClearFilters 
}: CommunitySearchProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };
  
  // Count active filters (excluding default values)
  const activeFilterCount = Object.entries(activeFilters).filter(([key, value]) => {
    if (key === 'activityStatus' && value !== 'all') return true;
    if (key === 'joinDate' && value !== 'newest') return true;
    if (key === 'role' && value !== 'all') return true;
    if (key === 'sort' && value !== 'recent') return true;
    return false;
  }).length;
  
  // Helper to check if a filter is active
  const isFilterActive = (type: string, value: string) => {
    return activeFilters[type as keyof typeof activeFilters] === value;
  };
  
  // Get filter label for badges
  const getFilterLabel = (type: string, value: string) => {
    switch (type) {
      case 'activityStatus':
        if (value === 'active') return 'Active Now';
        if (value === 'recent') return 'Recently Active';
        return 'All Members';
      case 'joinDate':
        return value === 'newest' ? 'Newest First' : 'Oldest First';
      case 'role':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'sort':
        if (value === 'recent') return 'Recently Active';
        if (value === 'az') return 'A-Z';
        if (value === 'za') return 'Z-A';
        return value;
      default:
        return value;
    }
  };

  // Active filter badges
  const FilterBadges = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.entries(activeFilters).map(([type, value]) => {
          // Skip default values
          if (
            (type === 'activityStatus' && value === 'all') ||
            (type === 'joinDate' && value === 'newest') ||
            (type === 'role' && value === 'all') ||
            (type === 'sort' && value === 'recent')
          ) {
            return null;
          }
          
          return (
            <Badge key={`${type}-${value}`} variant="secondary" className="px-2 py-1">
              {getFilterLabel(type, value)}
              <X 
                size={14} 
                className="ml-1 cursor-pointer" 
                onClick={() => {
                  // Reset to default value
                  const defaultValue = 
                    type === 'activityStatus' ? 'all' : 
                    type === 'joinDate' ? 'newest' : 
                    type === 'role' ? 'all' : 'recent';
                  onFilterChange(type, defaultValue);
                }}
              />
            </Badge>
          );
        })}
        
        {activeFilterCount > 0 && (
          <Badge 
            key="clear-all" 
            variant="outline" 
            className="px-2 py-1 cursor-pointer hover:bg-primary/10"
            onClick={onClearFilters}
          >
            Clear All
          </Badge>
        )}
      </div>
    );
  };

  return (
    <GlassPanel className="w-full max-w-6xl z-10 mb-6 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <Input
                type="search"
                placeholder="Search members..."
                value={inputValue}
                onChange={handleInputChange}
                className="pl-9 bg-white/5 border-white/10 text-white focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="relative border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary text-white rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    Activity Status
                  </DropdownMenuLabel>
                  <DropdownMenuItem 
                    className={isFilterActive('activityStatus', 'all') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('activityStatus', 'all')}
                  >
                    All Members
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('activityStatus', 'active') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('activityStatus', 'active')}
                  >
                    Active Now
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('activityStatus', 'recent') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('activityStatus', 'recent')}
                  >
                    Recently Active (30m)
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center">
                    <Calendar size={14} className="mr-2" />
                    Join Date
                  </DropdownMenuLabel>
                  <DropdownMenuItem 
                    className={isFilterActive('joinDate', 'newest') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('joinDate', 'newest')}
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('joinDate', 'oldest') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('joinDate', 'oldest')}
                  >
                    Oldest First
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center">
                    <User size={14} className="mr-2" />
                    User Role
                  </DropdownMenuLabel>
                  <DropdownMenuItem 
                    className={isFilterActive('role', 'all') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('role', 'all')}
                  >
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('role', 'admin') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('role', 'admin')}
                  >
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('role', 'moderator') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('role', 'moderator')}
                  >
                    Moderator
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('role', 'member') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('role', 'member')}
                  >
                    Member
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center">
                    <SortAsc size={14} className="mr-2" />
                    Sort By
                  </DropdownMenuLabel>
                  <DropdownMenuItem 
                    className={isFilterActive('sort', 'recent') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('sort', 'recent')}
                  >
                    Recently Active
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('sort', 'az') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('sort', 'az')}
                  >
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={isFilterActive('sort', 'za') ? 'bg-primary/20' : ''}
                    onClick={() => onFilterChange('sort', 'za')}
                  >
                    Name (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {activeFilterCount > 0 && (
                  <DropdownMenuItem onClick={onClearFilters}>
                    Clear All Filters
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              type="submit"
              className="flex items-center"
            >
              <Search size={16} className="mr-2" />
              Search
            </Button>
          </div>
        </div>
        
        <FilterBadges />
      </form>
    </GlassPanel>
  );
};

export default CommunitySearch;
