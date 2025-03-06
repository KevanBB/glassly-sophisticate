
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { toast } from 'sonner';
import StripeOAuthConnect from './StripeOAuthConnect';

interface StripeAccountCreationProps {
  refreshAccount: () => Promise<void>;
}

export const StripeAccountCreation = ({ refreshAccount }: StripeAccountCreationProps) => {
  const { createStripeAccount } = useStripeConnect();
  const [isCreating, setIsCreating] = useState(false);
  const [connectMethod, setConnectMethod] = useState<'standard' | 'oauth'>('standard');

  const handleCreateAccount = async () => {
    setIsCreating(true);
    try {
      const result = await createStripeAccount();
      if (result) {
        toast.success('Stripe account created successfully!');
        await refreshAccount();
      }
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      toast.error('Failed to create Stripe account');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={connectMethod === 'standard' ? 'default' : 'outline'} 
          onClick={() => setConnectMethod('standard')}
          size="sm"
        >
          Create New Account
        </Button>
        <Button 
          variant={connectMethod === 'oauth' ? 'default' : 'outline'} 
          onClick={() => setConnectMethod('oauth')}
          size="sm"
        >
          Connect Existing
        </Button>
      </div>

      {connectMethod === 'standard' ? (
        <div className="space-y-4">
          <p className="text-white/70">
            To receive payments from users, you need to connect your SubSpace account to Stripe.
          </p>
          <Button 
            onClick={handleCreateAccount} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating account...' : 'Create Stripe Account'}
          </Button>
        </div>
      ) : (
        <StripeOAuthConnect />
      )}
    </div>
  );
};

export default StripeAccountCreation;
