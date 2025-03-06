
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import GlassPanel from '@/components/ui/GlassPanel';
import { Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_user_id: string | null;
  details: any;
  created_at: string;
  admin_name?: string;
  target_name?: string;
}

const ActivityLog = () => {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminProfiles, setAdminProfiles] = useState<Record<string, any>>({});
  const [targetProfiles, setTargetProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchActivityLog();
  }, []);

  const fetchActivityLog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Collect unique user IDs (both admins and targets)
        const adminIds = [...new Set(data.map(item => item.admin_id))];
        const targetIds = [...new Set(data.map(item => item.target_user_id).filter(Boolean))];
        
        // Fetch admin profiles
        const { data: adminProfilesData, error: adminProfilesError } = await supabase
          .from('profiles')
          .select('id, display_name, first_name, last_name')
          .in('id', adminIds);

        if (adminProfilesError) throw adminProfilesError;
        
        // Create a lookup map for admin profiles
        const adminProfilesMap = adminProfilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
        
        setAdminProfiles(adminProfilesMap);
        
        // Fetch target profiles if there are any target IDs
        if (targetIds.length > 0) {
          const { data: targetProfilesData, error: targetProfilesError } = await supabase
            .from('profiles')
            .select('id, display_name, first_name, last_name')
            .in('id', targetIds);
            
          if (targetProfilesError) throw targetProfilesError;
          
          // Create a lookup map for target profiles
          const targetProfilesMap = targetProfilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, any>);
          
          setTargetProfiles(targetProfilesMap);
        }
        
        // Enrich the action data with profile information
        const enrichedActions = data.map(action => ({
          ...action,
          admin_name: getDisplayName(adminProfilesMap[action.admin_id]),
          target_name: action.target_user_id ? getDisplayName(targetProfiles[action.target_user_id]) : null
        }));
        
        setActions(enrichedActions);
      } else {
        setActions([]);
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (profile: any) => {
    if (!profile) return 'Unknown User';
    return profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed User';
  };

  const formatActionType = (actionType: string) => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getActionIcon = (actionType: string) => {
    // This could be expanded with more specific icons based on action type
    return <span className="text-primary">●</span>;
  };

  if (loading) {
    return (
      <GlassPanel className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading activity log...</span>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Activity Log</h2>
          <Button 
            variant="outline"
            size="sm"
            className="bg-transparent border-white/10 hover:bg-white/10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {actions.length > 0 ? (
          <div className="space-y-4">
            {actions.map(action => (
              <div key={action.id} className="border-b border-white/10 pb-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    {getActionIcon(action.action_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <span className="font-medium text-white">{action.admin_name}</span>
                        <span className="text-white/70"> {formatActionType(action.action_type)}</span>
                        {action.target_name && (
                          <span className="text-white/70"> for user <span className="text-white">{action.target_name}</span></span>
                        )}
                      </div>
                      <div className="text-sm text-white/50">
                        {new Date(action.created_at).toLocaleString()}
                      </div>
                    </div>
                    {action.details && (
                      <div className="mt-2 bg-white/5 p-2 rounded text-sm">
                        <pre className="whitespace-pre-wrap text-white/70 overflow-x-auto">
                          {JSON.stringify(action.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-white/50">
            No activity has been recorded yet.
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

export default ActivityLog;
