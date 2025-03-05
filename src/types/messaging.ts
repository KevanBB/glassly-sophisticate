
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

// User profile information
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Message types
export type MessageType = 'text' | 'image' | 'voice' | 'video';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: MessageType;
  created_at: string;
  read: boolean;
  self_destruct_time?: number | null;
  media_url?: string | null;
}

// Contact list types
export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_message?: Message;
}

// Conversation type
export interface Conversation {
  contact: Contact;
  lastMessage: Message | null;
  unreadCount: number;
}
