
import { supabase } from '@/integrations/supabase/client';
import { Contact, MessageType } from '@/types/messaging';

export const sendTextMessage = async (
  user: any, 
  contact: Contact, 
  content: string, 
  isSelfDestruct: boolean, 
  destructTime: number
) => {
  const messageData = {
    sender_id: user.id,
    receiver_id: contact.id,
    content: content,
    is_encrypted: true,
    is_self_destruct: isSelfDestruct,
    destruct_after: isSelfDestruct ? `${destructTime} minutes` : null,
    media_type: 'text',
  };
  
  const { error } = await supabase
    .from('messages')
    .insert(messageData);
    
  if (error) throw error;
  
  await ensureContactExists(user.id, contact.id);
};

export const uploadMediaMessage = async (
  file: File,
  user: any,
  contact: Contact,
  isSelfDestruct: boolean,
  destructTime: number
) => {
  // Determine media type
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  
  let mediaType: MessageType = 'text';
  if (isImage) mediaType = 'image';
  else if (isVideo) mediaType = 'video';
  else if (isAudio) mediaType = 'voice';
  
  // Upload file to storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('message_media')
    .upload(fileName, file);
    
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: urlData } = await supabase.storage
    .from('message_media')
    .getPublicUrl(fileName);
    
  // Send message with media
  const messageData = {
    sender_id: user.id,
    receiver_id: contact.id,
    content: mediaType === 'text' ? 'File attachment' : `${mediaType} attachment`,
    is_encrypted: true,
    is_self_destruct: isSelfDestruct,
    destruct_after: isSelfDestruct ? `${destructTime} minutes` : null,
    media_url: urlData.publicUrl,
    media_type: mediaType,
  };
  
  const { error } = await supabase
    .from('messages')
    .insert(messageData);
    
  if (error) throw error;
  
  await ensureContactExists(user.id, contact.id);
  
  return mediaType;
};

// Helper function to ensure contact exists in user's contacts
export const ensureContactExists = async (userId: string, contactId: string) => {
  const { data: existingContact, error: contactError } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .eq('contact_id', contactId)
    .maybeSingle();
    
  if (contactError) throw contactError;
  
  // If the contact is not in the contacts list, add them
  if (!existingContact) {
    await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_id: contactId
      });
  }
};
