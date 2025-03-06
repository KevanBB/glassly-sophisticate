
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface Application {
  id: string;
  status: string;
  created_at: string;
}

export const CreatorApplicationStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('creator_applications')
        .select('id, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        return;
      }

      setApplication(data);
    };

    fetchApplication();

    // Add subscription for creator approval notifications
    const notificationsSubscription = supabase
      .channel('creator-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id} AND type=eq.creator_approved` },
        () => {
          navigate('/creator/onboarding');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [user, navigate]);

  const handleCancel = async () => {
    if (!application || !user) return;

    try {
      const { error } = await supabase
        .from('creator_applications')
        .update({ status: 'cancelled' })
        .eq('id', application.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setApplication(prev => prev ? { ...prev, status: 'cancelled' } : null);
      
      toast({
        title: "Application Cancelled",
        description: "Your creator application has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling application:', error);
      toast({
        title: "Error",
        description: "Failed to cancel application. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!application) return null;

  return (
    <div className="bg-gunmetal/30 border border-white/10 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Creator Application Status</h3>
      <div className="space-y-2">
        <p className="text-white/70">
          Status: <span className="font-medium text-white">{application.status}</span>
        </p>
        <p className="text-white/70">
          Submitted: {format(new Date(application.created_at), 'PPP')}
        </p>
        {application.status === 'pending' && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="mt-4"
          >
            Cancel Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatorApplicationStatus;
