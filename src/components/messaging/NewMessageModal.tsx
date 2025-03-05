
import React, { useState, useEffect } from 'react';
import { X, Search, Plus, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import type { Contact } from '@/types/messaging';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, onSelectContact }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        // Get all contacts
        const { data: existingContacts, error: contactsError } = await supabase
          .from('contacts')
          .select('contact_id')
          .eq('user_id', user.id);
          
        if (contactsError) throw contactsError;
        
        // Get all users except current user
        const { data: allUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
          
        if (usersError) throw usersError;
        
        // Filter out users who are already contacts
        const contactIds = existingContacts?.map(c => c.contact_id) || [];
        const filteredUsers = allUsers.filter(u => !contactIds.includes(u.id));
        
        const formattedContacts: Contact[] = filteredUsers.map(u => ({
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          avatar_url: u.avatar_url,
        }));
        
        setContacts(formattedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Error fetching contacts",
          description: "There was a problem loading the contacts list.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [user, toast]);
  
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  const handleAddContact = async (contact: Contact) => {
    if (!user) return;
    
    try {
      // Check if contact already exists
      const { data: existingContact, error: checkError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .eq('contact_id', contact.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingContact) {
        onSelectContact(contact);
        return;
      }
      
      // Add new contact
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_id: contact.id,
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Contact added",
        description: `${contact.first_name} ${contact.last_name} has been added to your contacts.`,
      });
      
      onSelectContact(contact);
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error adding contact",
        description: "There was a problem adding this contact.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddByEmail = async () => {
    if (!email.trim() || !user) return;
    
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim())
        .maybeSingle();
        
      if (userError) throw userError;
      
      if (!userData) {
        toast({
          title: "User not found",
          description: "No user with that email address was found.",
          variant: "destructive"
        });
        return;
      }
      
      if (userData.id === user.id) {
        toast({
          title: "Invalid contact",
          description: "You cannot add yourself as a contact.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if already a contact
      const { data: existingContact, error: checkError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .eq('contact_id', userData.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingContact) {
        toast({
          title: "Contact exists",
          description: "This user is already in your contacts.",
          variant: "default"
        });
        
        const contact: Contact = {
          id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          avatar_url: userData.avatar_url,
        };
        
        onSelectContact(contact);
        return;
      }
      
      // Add new contact
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_id: userData.id,
        });
        
      if (insertError) throw insertError;
      
      const newContact: Contact = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
      };
      
      toast({
        title: "Contact added",
        description: `${userData.first_name} ${userData.last_name} has been added to your contacts.`,
      });
      
      onSelectContact(newContact);
    } catch (error) {
      console.error('Error adding contact by email:', error);
      toast({
        title: "Error adding contact",
        description: "There was a problem adding this contact.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-dark-200 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">New Message</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-white/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              
              <div className="mb-4">
                <button
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  className="flex items-center space-x-2 text-brand hover:text-brand-light transition-colors"
                >
                  <UserPlus size={18} />
                  <span>Add by email address</span>
                </button>
                
                {showEmailForm && (
                  <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mb-2 p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <button
                      onClick={handleAddByEmail}
                      disabled={!email.trim()}
                      className={`w-full py-2 rounded-lg ${
                        email.trim() ? 'bg-brand hover:bg-brand-light' : 'bg-white/10 text-white/30'
                      } text-white transition-colors`}
                    >
                      Add Contact
                    </button>
                  </div>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  [1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center space-x-3 p-3 mb-2 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-white/10"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-4 text-white/60">
                    <p>No contacts found</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleAddContact(contact)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                        {contact.avatar_url ? (
                          <img 
                            src={contact.avatar_url} 
                            alt={contact.first_name || 'Contact'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            {contact.first_name?.[0] || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {contact.first_name} {contact.last_name}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Plus size={18} className="text-white/60" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewMessageModal;
