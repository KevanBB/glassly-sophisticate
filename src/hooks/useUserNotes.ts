
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useUserNotes(userId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      setNotes(data || []);
    } catch (err: any) {
      console.error('Error fetching notes:', err.message);
      setError(err);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };
  
  const addNote = async (title: string, content: string) => {
    if (!userId) return null;
    
    try {
      const newNote = {
        user_id: userId,
        title,
        content
      };
      
      const { data, error } = await supabase
        .from('user_notes')
        .insert(newNote)
        .select()
        .single();
        
      if (error) throw error;
      
      setNotes([data, ...notes]);
      toast.success('Note added successfully');
      return data;
    } catch (error: any) {
      console.error('Error adding note:', error.message);
      toast.error('Failed to add note');
      return null;
    }
  };
  
  const updateNote = async (noteId: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setNotes(notes.map(note => 
        note.id === noteId 
          ? { ...note, title, content, updated_at: new Date().toISOString() } 
          : note
      ));
      
      toast.success('Note updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating note:', error.message);
      toast.error('Failed to update note');
      return false;
    }
  };
  
  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting note:', error.message);
      toast.error('Failed to delete note');
      return false;
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, [userId]);
  
  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote
  };
}
