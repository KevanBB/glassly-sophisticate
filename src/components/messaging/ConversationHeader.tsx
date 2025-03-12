
import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Contact } from '@/types/messaging';

interface ConversationHeaderProps {
  contact: Contact;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ contact }) => {
  return (
    <div className="p-4 border-b border-white/10 backdrop-blur-md bg-white/5 flex items-center">
      <div className="flex items-center space-x-3">
        <Link to={`/profile/${contact.email}`} className="block">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
            {contact.avatar_url ? (
              <img src={contact.avatar_url} alt={contact.first_name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
                {contact.first_name?.[0] || '?'}
              </div>
            )}
          </div>
        </Link>
        <div>
          <Link to={`/profile/${contact.email}`} className="hover:text-primary transition-colors">
            <h3 className="font-medium text-white">
              {contact.first_name} {contact.last_name}
            </h3>
          </Link>
          <div className="flex items-center text-xs text-white/60">
            <Lock size={12} className="mr-1" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
