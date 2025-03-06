
import React, { useState } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    enableUserRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableTwoFactorAuth: false,
    ipRestrictions: false,
    logRetentionDays: 30
  });

  // This is just for demonstration - in a real app, you would save settings to the database
  const saveSettings = async () => {
    try {
      // Log this action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          action_type: 'update_settings',
          target_user_id: null,
          details: settings
        });

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Admin Settings</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">User Authentication</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-registration" className="text-white">Enable User Registration</Label>
                <p className="text-sm text-white/50">Allow new users to create accounts</p>
              </div>
              <Switch 
                id="enable-registration" 
                checked={settings.enableUserRegistration}
                onCheckedChange={(checked) => setSettings({...settings, enableUserRegistration: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-verification" className="text-white">Require Email Verification</Label>
                <p className="text-sm text-white/50">Users must verify email before accessing the app</p>
              </div>
              <Switch 
                id="email-verification" 
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor" className="text-white">Enable Two-Factor Authentication</Label>
                <p className="text-sm text-white/50">Require 2FA for admin accounts</p>
              </div>
              <Switch 
                id="two-factor" 
                checked={settings.enableTwoFactorAuth}
                onCheckedChange={(checked) => setSettings({...settings, enableTwoFactorAuth: checked})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Security Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session-timeout" className="text-white">Session Timeout (minutes)</Label>
                <p className="text-sm text-white/50">Automatically log out inactive users</p>
              </div>
              <Input 
                id="session-timeout" 
                type="number" 
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) || 60})}
                className="w-24 bg-glass-10 border-white/10 text-white"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="login-attempts" className="text-white">Max Login Attempts</Label>
                <p className="text-sm text-white/50">Lock account after X failed login attempts</p>
              </div>
              <Input 
                id="login-attempts" 
                type="number" 
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value) || 5})}
                className="w-24 bg-glass-10 border-white/10 text-white"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip-restrictions" className="text-white">IP Restrictions</Label>
                <p className="text-sm text-white/50">Restrict login access to specific IP addresses</p>
              </div>
              <Switch 
                id="ip-restrictions" 
                checked={settings.ipRestrictions}
                onCheckedChange={(checked) => setSettings({...settings, ipRestrictions: checked})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Data Management</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log-retention" className="text-white">Log Retention (days)</Label>
                <p className="text-sm text-white/50">How long to keep activity logs</p>
              </div>
              <Input 
                id="log-retention" 
                type="number" 
                value={settings.logRetentionDays}
                onChange={(e) => setSettings({...settings, logRetentionDays: parseInt(e.target.value) || 30})}
                className="w-24 bg-glass-10 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={saveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default AdminSettings;
