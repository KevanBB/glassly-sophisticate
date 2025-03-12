
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file' | 'voice';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content?: string;
  media_url?: string;
  media_type: MessageType;
  created_at: string;
  read_at?: string;
  is_self_destruct: boolean;
  destruct_after?: string;
  
  // Additional properties needed by components
  type?: MessageType; // Alias for media_type for backward compatibility
  read?: boolean; // Computed from read_at
  self_destruct_time?: number; // Parsed from destruct_after
}

export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active?: string | null;
  is_active?: boolean;
  
  // Additional properties needed by components
  lastMessage?: {
    id: string;
    sender_id: string;
    receiver_id: string;
    content?: string;
    type?: MessageType;
    created_at: string;
    read?: boolean;
    media_url?: string;
    self_destruct_time?: number;
  };
  unreadCount?: number;
  email?: string | null; // Optional for backward compatibility
}

export interface DestructTimerOption {
  value: string;
  label: string;
}
