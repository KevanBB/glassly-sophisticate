
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Ban, CheckCircle, Shield, Trash2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin';
  is_active: boolean | null;
  last_active: string | null;
  joined_at: string | null;
  email?: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(
        users.filter(u => 
          u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          u.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          u.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('last_active', { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      // Fetch user emails from auth.users (this requires admin privileges)
      // Note: This is a simplified example. In a real app, you might want to create an edge function
      // for this since direct access to auth.users isn't available through client SDK
      const usersWithEmails = profilesData.map(profile => ({
        ...profile,
        email: `user_${profile.id.substring(0, 6)}@example.com`, // Placeholder for demo
        role: profile.role as 'user' | 'moderator' | 'admin' // Explicitly cast the role to the required type
      }));

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          action_type: 'update_role',
          target_user_id: userId,
          details: { new_role: newRole }
        });

      // Update local state
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const toggleUserActiveStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          action_type: newStatus ? 'activate_user' : 'deactivate_user',
          target_user_id: userId,
          details: { new_status: newStatus }
        });

      // Update local state
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, is_active: newStatus } : u)
      );

      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">Admin</span>;
      case 'moderator':
        return <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Moderator</span>;
      default:
        return <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">User</span>;
    }
  };

  if (loading) {
    return (
      <GlassPanel className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading users...</span>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 bg-glass-10 border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-white/70">User</th>
                <th className="text-left p-3 text-white/70">Email</th>
                <th className="text-left p-3 text-white/70">Status</th>
                <th className="text-left p-3 text-white/70">Role</th>
                <th className="text-left p-3 text-white/70">Joined</th>
                <th className="text-left p-3 text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((userData) => (
                  <tr key={userData.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          <img 
                            src={userData.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                            alt={userData.display_name || "User"} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {userData.display_name || `${userData.first_name || ''} ${userData.last_name || ''}`  || 'Anonymous User'}
                          </div>
                          <div className="text-xs text-white/50">ID: {userData.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-white/80">{userData.email}</td>
                    <td className="p-3">
                      {userData.is_active ? (
                        <span className="text-green-400 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          <Ban className="h-4 w-4 mr-1" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {renderRoleBadge(userData.role)}
                    </td>
                    <td className="p-3 text-white/80">
                      {userData.joined_at 
                        ? new Date(userData.joined_at).toLocaleDateString() 
                        : 'Unknown'}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleUserActiveStatus(userData.id, !!userData.is_active)}
                          className="bg-transparent border-white/10 hover:bg-white/10"
                          disabled={user?.id === userData.id}
                        >
                          {userData.is_active ? (
                            <Ban className="h-4 w-4 mr-1 text-red-400" />
                          ) : (
                            <UserCheck className="h-4 w-4 mr-1 text-green-400" />
                          )}
                          {userData.is_active ? 'Suspend' : 'Activate'}
                        </Button>
                        
                        {userData.role !== 'admin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateUserRole(userData.id, 'admin')}
                            className="bg-transparent border-white/10 hover:bg-white/10"
                            disabled={user?.id === userData.id}
                          >
                            <Shield className="h-4 w-4 mr-1 text-primary" />
                            Make Admin
                          </Button>
                        )}
                        
                        {userData.role === 'admin' && userData.id !== user?.id && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateUserRole(userData.id, 'user')}
                            className="bg-transparent border-white/10 hover:bg-white/10"
                          >
                            <Shield className="h-4 w-4 mr-1 text-gray-400" />
                            Remove Admin
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-white/50">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
};

export default UserManagement;
