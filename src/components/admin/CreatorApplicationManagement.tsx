
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Calendar, Clock, FileText, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
}

interface CreatorApplication {
  id: string;
  user_id: string;
  legal_first_name: string;
  legal_middle_name: string | null;
  legal_last_name: string;
  display_name: string | null;
  birthday: string;
  email: string | null;
  address: string;
  id_front_url: string;
  id_back_url: string;
  id_selfie_url: string;
  created_at: string;
  status: string;
  denial_reason?: string;
  profile_display_name?: string | null;
  profile_avatar_url?: string | null;
}

const denialReasons = [
  { id: 'id_mismatch', name: 'ID and name mismatch' },
  { id: 'age_requirement', name: 'Does not meet age requirements' },
  { id: 'incomplete_docs', name: 'Incomplete documentation' },
  { id: 'unclear_photos', name: 'Unclear ID photos' },
  { id: 'suspicious_activity', name: 'Suspicious account activity' },
  { id: 'terms_violation', name: 'Violation of terms of service' },
  { id: 'other', name: 'Other reason' },
];

const fetchCreatorApplications = async () => {
  console.log('Fetching creator applications...');
  
  // Use the direct table approach with join
  const { data, error } = await supabase
    .from('creator_applications')
    .select(`
      *,
      profiles:profiles(display_name, avatar_url)
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
  
  console.log('Fetched applications:', data);
  return data;
};

const CreatorApplicationManagement = () => {
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [denialReason, setDenialReason] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['creatorApplications'],
    queryFn: fetchCreatorApplications,
  });

  const updateApplicationStatus = async ({ id, status, reason = null }: { id: string; status: string; reason?: string | null }) => {
    const { error } = await supabase
      .from('creator_applications')
      .update({ 
        status,
        ...(reason && { denial_reason: reason })
      })
      .eq('id', id);

    if (error) throw error;
    
    // Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: (await supabase.auth.getUser()).data.user?.id,
      action_type: `creator_application_${status}`,
      target_user_id: selectedApplication?.user_id,
      details: { 
        application_id: id,
        status,
        ...(reason && { reason })
      }
    });
    
    return { id, status };
  };

  const mutation = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorApplications'] });
      setConfirmDialogOpen(false);
      setSelectedApplication(null);
      setDenialReason('');
      
      const message = actionType === 'approve' 
        ? 'Application approved successfully' 
        : 'Application denied successfully';
      
      toast.success(message);
    },
    onError: (error) => {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    },
  });

  const handleApprove = (application: CreatorApplication) => {
    setSelectedApplication(application);
    setActionType('approve');
    setConfirmDialogOpen(true);
  };

  const handleDeny = (application: CreatorApplication) => {
    setSelectedApplication(application);
    setActionType('deny');
    setConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedApplication || !actionType) return;
    
    if (actionType === 'approve') {
      mutation.mutate({ id: selectedApplication.id, status: 'approved' });
    } else {
      if (!denialReason) {
        toast.error('Please select a reason for denial');
        return;
      }
      
      mutation.mutate({ 
        id: selectedApplication.id, 
        status: 'rejected',
        reason: denialReason
      });
    }
  };

  const viewApplicationDetails = (application: CreatorApplication) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  if (error) {
    return (
      <GlassPanel className="p-6">
        <div className="text-white">
          <p>Error loading creator applications: {error.message}</p>
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Creator Applications
        </h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 bg-white/10" />
                    <Skeleton className="h-4 w-24 bg-white/10" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-20 bg-white/10 rounded-md" />
                    <Skeleton className="h-9 w-20 bg-white/10 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.filter(app => app.status === 'pending').map((application) => (
              <div key={application.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className="font-medium text-white flex items-center">
                      {application.profiles?.display_name || 
                       application.display_name || 
                       `${application.legal_first_name} ${application.legal_last_name}`}
                    </h3>
                    <div className="flex items-center text-sm text-white/60 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">Applied: {format(new Date(application.created_at), 'PPP')}</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{format(new Date(application.created_at), 'p')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white/80"
                      onClick={() => viewApplicationDetails(application)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(application)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeny(application)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {applications.filter(app => app.status === 'pending').length === 0 && (
              <div className="text-center py-8 text-white/60">
                No pending creator applications to review.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            No creator applications found.
          </div>
        )}
      </GlassPanel>

      {/* Application Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gunmetal border border-white/10 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription className="text-white/70">
              Review creator application details
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white/60">Legal Name</h4>
                  <p className="text-white">
                    {selectedApplication.legal_first_name} 
                    {selectedApplication.legal_middle_name ? ` ${selectedApplication.legal_middle_name} ` : ' '}
                    {selectedApplication.legal_last_name}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/60">Display Name</h4>
                  <p className="text-white">{selectedApplication.display_name || 'Not provided'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/60">Date of Birth</h4>
                  <p className="text-white">{format(new Date(selectedApplication.birthday), 'PPP')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/60">Email</h4>
                  <p className="text-white">{selectedApplication.email || 'Not provided'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-white/60">Address</h4>
                  <p className="text-white">{selectedApplication.address}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-white/60 mb-4">ID Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm mb-2">ID Front</p>
                    <div className="aspect-[3/2] bg-black/40 rounded-md overflow-hidden">
                      <img 
                        src={selectedApplication.id_front_url} 
                        alt="ID Front" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2">ID Back</p>
                    <div className="aspect-[3/2] bg-black/40 rounded-md overflow-hidden">
                      <img 
                        src={selectedApplication.id_back_url} 
                        alt="ID Back" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2">Selfie with ID</p>
                    <div className="aspect-[3/2] bg-black/40 rounded-md overflow-hidden">
                      <img 
                        src={selectedApplication.id_selfie_url} 
                        alt="Selfie with ID" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline" 
                  className="border-white/20"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setDetailsOpen(false);
                    handleApprove(selectedApplication);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsOpen(false);
                    handleDeny(selectedApplication);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Deny
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-gunmetal border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Application' : 'Deny Application'}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {actionType === 'approve' 
                ? 'Are you sure you want to approve this creator application?' 
                : 'Please select a reason for denying this application.'}
            </DialogDescription>
          </DialogHeader>
          
          {actionType === 'deny' && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-white/70 mb-2">Reason for Denial</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-white/20 text-white"
                  >
                    {denialReason 
                      ? denialReasons.find(r => r.id === denialReason)?.name || 'Select reason'
                      : 'Select reason'
                    }
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gunmetal border border-white/10 text-white w-[calc(100%-2rem)]">
                  {denialReasons.map((reason) => (
                    <DropdownMenuItem
                      key={reason.id}
                      onClick={() => setDenialReason(reason.id)}
                      className={cn(
                        "cursor-pointer hover:bg-white/10",
                        denialReason === reason.id && "bg-white/10"
                      )}
                    >
                      {reason.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="border-white/20"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={confirmAction}
              disabled={mutation.isPending || (actionType === 'deny' && !denialReason)}
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Denial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorApplicationManagement;
