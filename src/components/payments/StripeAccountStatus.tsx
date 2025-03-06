
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, XCircle } from 'lucide-react';
import { StripeAccount } from '@/hooks/useStripeConnect';

interface StripeAccountStatusProps {
  stripeAccount: StripeAccount | null;
  refreshAccount: () => Promise<void>;
  isOnboarded: boolean;
}

export const StripeAccountStatus = ({ 
  stripeAccount, 
  refreshAccount, 
  isOnboarded 
}: StripeAccountStatusProps) => {
  if (isOnboarded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-green-500">
          <Check className="h-5 w-5" />
          <span className="font-semibold">Your Stripe account is fully set up!</span>
        </div>
        <p className="text-white/70">
          You can now receive payments from users. Stripe will automatically transfer funds to your bank account.
        </p>
        <Button 
          variant="outline" 
          onClick={refreshAccount}
          className="w-full"
        >
          Refresh Account Status
          <RefreshCw className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-white/70">
        Your Stripe account has been created, but you need to complete the onboarding process to receive payments.
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`h-4 w-4 rounded-full ${stripeAccount?.details_submitted ? 'bg-green-500' : 'bg-red-500'}`}>
            {stripeAccount?.details_submitted ? <Check className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
          </div>
          <span className="text-sm text-white/70">Account details submitted</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`h-4 w-4 rounded-full ${stripeAccount?.charges_enabled ? 'bg-green-500' : 'bg-red-500'}`}>
            {stripeAccount?.charges_enabled ? <Check className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
          </div>
          <span className="text-sm text-white/70">Payment processing enabled</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`h-4 w-4 rounded-full ${stripeAccount?.payouts_enabled ? 'bg-green-500' : 'bg-red-500'}`}>
            {stripeAccount?.payouts_enabled ? <Check className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
          </div>
          <span className="text-sm text-white/70">Payouts enabled</span>
        </div>
      </div>
    </div>
  );
};

export default StripeAccountStatus;
