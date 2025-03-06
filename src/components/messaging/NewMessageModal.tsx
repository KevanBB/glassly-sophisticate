
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Search, UserPlus, X } from 'lucide-react';
import type { Contact } from '@/types/messaging';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

// Types to fix the infinite instantiation issue
type DBProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, onSelectContact }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DBProfile[]>([]);
  const [existingContacts, setExistingContacts] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    // Fetch existing contacts
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('contact_id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const contactIds = data.map(contact => contact.contact_id);
        setExistingContacts(contactIds);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    
    fetchContacts();
  }, [user]);
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    
    setIsSearching(true);
    try {
      // Debug the search query
      console.log('Searching for:', searchQuery);

      // Update the query to use ilike for partial matches and make it more flexible
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, updated_at')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .neq('id', user.id)
        .limit(10);
        
      if (error) throw error;
      
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching for users:', error);
      toast({
        title: "Search error",
        description: "There was a problem searching for users.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Add automatic search when query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (searchQuery === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const handleAddContact = async (profile: DBProfile) => {
    if (!user) return;
    
    try {
      // Check if contact already exists
      if (existingContacts.includes(profile.id)) {
        // If exists, just select the contact
        const contact: Contact = {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
        };
        onSelectContact(contact);
        onClose();
        return;
      }
      
      // Add new contact
      const { error } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_id: profile.id
        });
        
      if (error) throw error;
      
      // Update existing contacts
      setExistingContacts(prev => [...prev, profile.id]);
      
      // Select the contact
      const contact: Contact = {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
      };
      
      toast({
        title: "Contact added",
        description: `${profile.first_name || ''} ${profile.last_name || ''} has been added to your contacts.`,
        variant: "default"
      });
      
      onSelectContact(contact);
      onClose();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error adding contact",
        description: "There was a problem adding this contact.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-dark border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">New Message</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="relative">
            <div className="flex">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 p-3 rounded-l-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-brand hover:bg-brand-light text-white p-3 rounded-r-md transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4 text-white/60">
                {searchQuery ? 'No users found' : 'Search for users to start a conversation'}
              </div>
            ) : (
              searchResults.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                  onClick={() => handleAddContact(profile)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.first_name || 'User'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-medium">
                          {profile.first_name?.[0] || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {profile.first_name || ''} {profile.last_name || ''}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    className={`p-2 rounded-full ${existingContacts.includes(profile.id) ? 'text-brand' : 'text-white/70 hover:bg-white/10'}`}
                  >
                    {existingContacts.includes(profile.id) ? (
                      <X size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;
