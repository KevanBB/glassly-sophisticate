
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file';

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
}

export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active?: string | null;
  is_active?: boolean;
}

export interface DestructTimerOption {
  value: string;
  label: string;
}
