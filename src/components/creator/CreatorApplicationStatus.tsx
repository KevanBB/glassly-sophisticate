
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
  const [isLoading, setIsLoading] = useState(false);

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

    // Also listen for status changes in the creator_applications table
    const applicationsSubscription = supabase
      .channel('application-updates')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'creator_applications', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          // Update the local state when the application status changes
          if (payload.new && payload.new.status) {
            setApplication(prev => prev ? { ...prev, status: payload.new.status } : null);
            
            // If approved, show notification and prepare to redirect
            if (payload.new.status === 'approved') {
              toast({
                title: "Application Approved",
                description: "Your creator application has been approved! Redirecting to onboarding...",
              });
              // Short delay before redirect to allow the user to see the toast
              setTimeout(() => navigate('/creator/onboarding'), 1500);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsSubscription);
      supabase.removeChannel(applicationsSubscription);
    };
  }, [user, navigate, toast]);

  const handleCancel = async () => {
    if (!application || !user) return;
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (!application) return null;

  return (
    <div className="bg-gunmetal/30 border border-white/10 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Creator Application Status</h3>
      <div className="space-y-2">
        <p className="text-white/70">
          Status: <span className={`font-medium ${application.status === 'approved' ? 'text-green-400' : application.status === 'rejected' ? 'text-red-400' : application.status === 'cancelled' ? 'text-gray-400' : 'text-white'}`}>
            {application.status}
          </span>
        </p>
        <p className="text-white/70">
          Submitted: {format(new Date(application.created_at), 'PPP')}
        </p>
        {application.status === 'pending' && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Application'}
          </Button>
        )}
        {application.status === 'approved' && (
          <Button
            variant="default"
            onClick={() => navigate('/creator/onboarding')}
            className="mt-4"
          >
            Continue to Onboarding
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatorApplicationStatus;
