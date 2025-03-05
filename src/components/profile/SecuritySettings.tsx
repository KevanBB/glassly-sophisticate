
import React, { useState } from 'react';
import { Shield, Key, History, Server, Smartphone } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SecuritySettingsProps {
  profile: any;
  user: any;
}

const SecuritySettings = ({ profile, user }: SecuritySettingsProps) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    encryptedMessages: true,
    loginNotifications: true,
    autoLogout: false,
  });
  
  const [loginHistory] = useState([
    { 
      device: "iPhone 13", 
      location: "New York, US", 
      ip: "192.168.1.1", 
      time: "Today, 10:23 AM",
      current: true
    },
    { 
      device: "Chrome on Windows", 
      location: "New York, US", 
      ip: "192.168.1.2", 
      time: "Yesterday, 8:45 PM",
      current: false
    },
    { 
      device: "Safari on MacBook", 
      location: "Boston, US", 
      ip: "192.168.1.3", 
      time: "Aug 24, 2023, 3:12 PM",
      current: false
    },
  ]);
  
  const handleToggleChange = (setting: string, value: boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: value
    });
    
    // Show toast for 2FA since it would typically need additional setup
    if (setting === 'twoFactorEnabled') {
      if (value) {
        toast.info("Two-factor authentication setup would launch here.");
      } else {
        toast.warning("Two-factor authentication disabled.");
      }
    }
  };
  
  const handleLogoutDevice = (device: string) => {
    toast.success(`Logged out from ${device}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Security Settings</h2>
        <Button 
          className="bg-brand hover:bg-brand/90 text-white"
          onClick={() => toast.success("Security settings saved!")}
        >
          Save Changes
        </Button>
      </div>
      
      {/* Security Controls */}
      <GlassPanel className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="text-brand h-5 w-5" />
          <h3 className="text-lg font-medium text-white">Security Controls</h3>
        </div>
        <Separator className="bg-white/10" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Two-Factor Authentication</Label>
              <p className="text-xs text-white/60">Add an extra layer of security to your account</p>
            </div>
            <Switch 
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => handleToggleChange('twoFactorEnabled', checked)}
            />
          </div>
          
          <Separator className="bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Encrypted Messages</Label>
              <p className="text-xs text-white/60">Enable end-to-end encryption for all messages</p>
            </div>
            <Switch 
              checked={securitySettings.encryptedMessages}
              onCheckedChange={(checked) => handleToggleChange('encryptedMessages', checked)}
            />
          </div>
          
          <Separator className="bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Login Notifications</Label>
              <p className="text-xs text-white/60">Receive notifications for new login attempts</p>
            </div>
            <Switch 
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => handleToggleChange('loginNotifications', checked)}
            />
          </div>
          
          <Separator className="bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white cursor-pointer">Auto Logout (30 min)</Label>
              <p className="text-xs text-white/60">Automatically logout after inactivity</p>
            </div>
            <Switch 
              checked={securitySettings.autoLogout}
              onCheckedChange={(checked) => handleToggleChange('autoLogout', checked)}
            />
          </div>
        </div>
      </GlassPanel>
      
      {/* Digital Media Vault */}
      <GlassPanel className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Key className="text-brand h-5 w-5" />
          <h3 className="text-lg font-medium text-white">Digital Media Vault</h3>
        </div>
        <Separator className="bg-white/10" />
        
        <p className="text-sm text-white/70">
          Store and protect sensitive media and documents with encryption. Your content is only 
          accessible to you and those you explicitly grant permission to.
        </p>
        
        <div className="flex space-x-4">
          <Button className="bg-brand hover:bg-brand/90 text-white">
            Access Vault
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                Manage Permissions
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-100 border border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Vault Access Permissions</DialogTitle>
                <DialogDescription className="text-white/70">
                  Control who has access to your private content.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-white/80 mb-4">No users currently have access to your vault.</p>
                <Button className="w-full bg-brand/80 hover:bg-brand text-white">
                  Add Trusted Contact
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </GlassPanel>
      
      {/* Login History */}
      <GlassPanel className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <History className="text-brand h-5 w-5" />
          <h3 className="text-lg font-medium text-white">Login Activity</h3>
        </div>
        <Separator className="bg-white/10" />
        
        <div className="space-y-4">
          {loginHistory.map((login, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-white/70" />
                  <p className="text-sm font-medium text-white">
                    {login.device}
                    {login.current && (
                      <span className="ml-2 text-xs bg-brand/20 text-brand px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                </div>
                <div className="ml-6 text-xs text-white/60">
                  {login.location} • {login.ip} • {login.time}
                </div>
              </div>
              
              {!login.current && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => handleLogoutDevice(login.device)}
                >
                  Log out
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2 border-white/20 text-white hover:bg-white/5"
          onClick={() => toast.success("All devices logged out successfully!")}
        >
          Log out of all devices
        </Button>
      </GlassPanel>
      
      {/* Data Management */}
      <GlassPanel className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Server className="text-brand h-5 w-5" />
          <h3 className="text-lg font-medium text-white">Data Management</h3>
        </div>
        <Separator className="bg-white/10" />
        
        <p className="text-sm text-white/70">
          Manage your personal data and privacy options.
        </p>
        
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/5"
            onClick={() => toast.success("Your data has been downloaded!")}
          >
            Download My Data
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-100 border border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Delete Your Account</DialogTitle>
                <DialogDescription className="text-white/70">
                  This action is permanent and cannot be undone. All your data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-white/90 mb-4">Please type "DELETE" to confirm:</p>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-white"
                  placeholder="Type DELETE here"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button variant="destructive">
                  Delete Permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </GlassPanel>
    </div>
  );
};

export default SecuritySettings;
