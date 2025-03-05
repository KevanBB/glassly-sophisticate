
import React, { useState, useEffect } from 'react';
import { Link, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialLinksProps {
  editing: boolean;
  userId: string;
}

const SocialLinks = ({ editing, userId }: SocialLinksProps) => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  
  useEffect(() => {
    fetchSocialLinks();
  }, [userId]);
  
  const fetchSocialLinks = async () => {
    try {
      // This would normally fetch from a social_links table
      // For now, we'll use mock data
      setLinks([
        { id: '1', platform: 'Twitter', url: 'https://twitter.com/username' },
        { id: '2', platform: 'Instagram', url: 'https://instagram.com/username' }
      ]);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };
  
  const handleAddLink = () => {
    if (!newLink.platform || !newLink.url) {
      toast.error('Please enter both platform name and URL');
      return;
    }
    
    // Add link logic - would normally save to database
    setLinks([...links, { ...newLink, id: Date.now().toString() }]);
    setNewLink({ platform: '', url: '' });
    toast.success('Social link added');
  };
  
  const handleRemoveLink = (id: string) => {
    // Remove link logic - would normally delete from database
    setLinks(links.filter(link => link.id !== id));
    toast.success('Social link removed');
  };
  
  return (
    <GlassPanel className="p-6 space-y-4">
      <h3 className="text-lg font-medium text-white">Social Links</h3>
      <Separator className="bg-white/10" />
      
      <div className="space-y-4">
        {links.length > 0 ? (
          <div className="space-y-2">
            {links.map(link => (
              <div key={link.id} className="flex items-center justify-between bg-white/5 rounded-md p-3">
                <div className="flex items-center">
                  <Link size={16} className="text-white/60 mr-2" />
                  <span className="text-white/80 mr-2">{link.platform}:</span>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline truncate max-w-[200px]"
                  >
                    {link.url}
                  </a>
                </div>
                
                {editing && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveLink(link.id)} 
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-sm">No social links added yet.</p>
        )}
        
        {editing && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/80">Platform</Label>
                <Input 
                  value={newLink.platform}
                  onChange={e => setNewLink({...newLink, platform: e.target.value})}
                  placeholder="e.g. Twitter, Instagram"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-white/80">URL</Label>
                <Input 
                  value={newLink.url}
                  onChange={e => setNewLink({...newLink, url: e.target.value})}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAddLink}
              size="sm"
              className="mt-2"
            >
              <Plus size={16} className="mr-1" /> Add Link
            </Button>
          </div>
        )}
      </div>
    </GlassPanel>
  );
};

export default SocialLinks;
