
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { useStripeConnectContext } from './StripeConnectProvider';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw, Settings } from 'lucide-react';

export const StripeAccountManagement = () => {
  const { stripeAccountId, refreshAccount } = useStripeConnectContext();
  const { createManagedAccount, updateStripeAccount, loading } = useStripeConnect();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCreateManagedAccount = async () => {
    setIsCreating(true);
    try {
      const result = await createManagedAccount();
      if (result) {
        toast.success('Managed Stripe account created successfully!');
        await refreshAccount();
      }
    } catch (error) {
      console.error('Error creating managed Stripe account:', error);
      toast.error('Failed to create managed Stripe account');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!stripeAccountId) {
      toast.error('No Stripe account found to update');
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateStripeAccount(stripeAccountId, {
        business_type: 'individual'
      });
      
      if (result) {
        toast.success('Stripe account updated successfully!');
        await refreshAccount();
      }
    } catch (error) {
      console.error('Error updating Stripe account:', error);
      toast.error('Failed to update Stripe account');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="bg-gunmetal/30 border border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Stripe Account Management</CardTitle>
        <CardDescription className="text-white/70">
          Advanced options for your Stripe account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Create Managed Account</h4>
          <p className="text-xs text-white/60">
            Create a fully managed Stripe account with platform controls
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCreateManagedAccount}
            disabled={isCreating || loading}
            className="w-full mt-2"
          >
            {isCreating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Managed Account
              </>
            )}
          </Button>
        </div>

        {stripeAccountId && (
          <div className="space-y-2 pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-white/80">Update Account</h4>
            <p className="text-xs text-white/60">
              Update your Stripe account settings
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleUpdateAccount}
              disabled={isUpdating || loading}
              className="w-full mt-2"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating Account...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Update Account Settings
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeAccountManagement;
