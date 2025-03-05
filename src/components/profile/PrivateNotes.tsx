
import React, { useState, useEffect } from 'react';
import { Book, Edit, Save, Trash, Plus, X, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface PrivateNotesProps {
  userId: string;
}

const PrivateNotes = ({ userId }: PrivateNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  
  useEffect(() => {
    fetchNotes();
  }, [userId]);
  
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      setNotes(data || []);
    } catch (error: any) {
      console.error('Error fetching notes:', error.message);
      toast.error('Failed to load notes');
    }
  };
  
  const handleAddNote = async () => {
    if (!newNoteTitle.trim()) {
      toast.error('Please provide a title for your note');
      return;
    }
    
    try {
      const newNote = {
        user_id: userId,
        title: newNoteTitle,
        content: newNoteContent
      };
      
      const { data, error } = await supabase
        .from('user_notes')
        .insert(newNote)
        .select()
        .single();
        
      if (error) throw error;
      
      setNotes([data, ...notes]);
      setIsAddingNote(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      toast.success('Note added successfully');
    } catch (error: any) {
      console.error('Error adding note:', error.message);
      toast.error('Failed to add note');
    }
  };
  
  const handleUpdateNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    try {
      const { error } = await supabase
        .from('user_notes')
        .update({
          title: note.title,
          content: note.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);
        
      if (error) throw error;
      
      setEditingNoteId(null);
      toast.success('Note updated successfully');
    } catch (error: any) {
      console.error('Error updating note:', error.message);
      toast.error('Failed to update note');
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId);
        
      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error: any) {
      console.error('Error deleting note:', error.message);
      toast.error('Failed to delete note');
    }
  };
  
  const updateNoteField = (noteId: string, field: 'title' | 'content', value: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, [field]: value } 
        : note
    ));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const cancelAddingNote = () => {
    setIsAddingNote(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };
  
  return (
    <GlassPanel className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Book className="mr-2 text-primary" />
          <h3 className="text-lg font-medium text-white">Private Notes</h3>
        </div>
        
        {!isAddingNote && (
          <Button onClick={() => setIsAddingNote(true)} size="sm" className="bg-primary/20 hover:bg-primary/30 text-white">
            <Plus size={16} className="mr-1.5" />
            Add Note
          </Button>
        )}
      </div>
      <Separator className="bg-white/10" />
      
      <div className="space-y-4">
        {isAddingNote && (
          <div className="bg-white/5 rounded-md p-4 border border-white/10">
            <div className="mb-3">
              <Input
                placeholder="Note Title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/50 mb-2"
              />
              <Textarea
                placeholder="Write your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/50 min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={cancelAddingNote} className="text-white/70">
                <X size={16} className="mr-1.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddNote}>
                <Save size={16} className="mr-1.5" />
                Save Note
              </Button>
            </div>
          </div>
        )}
        
        {notes.length === 0 && !isAddingNote && (
          <div className="text-center py-6">
            <PenSquare className="mx-auto h-12 w-12 text-white/20 mb-2" />
            <h4 className="text-white/70 font-medium mb-1">No Private Notes Yet</h4>
            <p className="text-white/50 text-sm mb-4">
              Add notes about this person that only you can see.
            </p>
            <Button 
              onClick={() => setIsAddingNote(true)}
              className="bg-primary/20 hover:bg-primary/30 text-white"
            >
              <Plus size={16} className="mr-1.5" />
              Create Your First Note
            </Button>
          </div>
        )}
        
        {notes.map(note => (
          <div 
            key={note.id} 
            className="bg-white/5 rounded-md p-4 border border-white/10"
          >
            {editingNoteId === note.id ? (
              <div>
                <Input
                  value={note.title}
                  onChange={(e) => updateNoteField(note.id, 'title', e.target.value)}
                  className="bg-white/10 border-white/10 text-white mb-2"
                />
                <Textarea
                  value={note.content}
                  onChange={(e) => updateNoteField(note.id, 'content', e.target.value)}
                  className="bg-white/10 border-white/10 text-white min-h-[120px] mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingNoteId(null)}
                    className="text-white/70"
                  >
                    <X size={16} className="mr-1.5" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateNote(note.id)}
                  >
                    <Save size={16} className="mr-1.5" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-white">{note.title}</h4>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingNoteId(note.id)}
                      className="h-7 w-7 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-7 w-7 p-0 rounded-full text-white/70 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
                <p className="text-white/80 whitespace-pre-wrap text-sm mb-2">{note.content}</p>
                <p className="text-white/50 text-xs">
                  Last updated: {formatDate(note.updated_at)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Alert className="bg-blue-900/20 border-blue-500/30 text-blue-100">
        <Book className="h-4 w-4 text-blue-400" />
        <AlertTitle>Private Information</AlertTitle>
        <AlertDescription className="text-blue-200/80">
          Notes are private and only visible to you. They're a great way to remember important details about people.
        </AlertDescription>
      </Alert>
    </GlassPanel>
  );
};

export default PrivateNotes;
