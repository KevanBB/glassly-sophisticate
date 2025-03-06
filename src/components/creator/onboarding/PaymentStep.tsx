
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import StripeOnboarding from '@/components/payments/StripeOnboarding';
import { useStripeConnectContext } from '@/components/payments/StripeConnectProvider';
import { toast } from 'sonner';

interface PaymentStepProps {
  onComplete: () => void;
}

const PaymentStep = ({ onComplete }: PaymentStepProps) => {
  const { isOnboarded, hasStripeAccount, loading } = useStripeConnectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    // If stripe account exists but not onboarded, show a warning
    if (hasStripeAccount && !isOnboarded) {
      toast.warning('Please complete your Stripe onboarding before proceeding');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = loading || isSubmitting || (hasStripeAccount && !isOnboarded);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Payment Processing Setup</h2>
      <p className="text-white/80 mb-4">
        To receive payments from your subscribers and tips, you need to connect your SubSpace account to Stripe.
      </p>
      
      <StripeOnboarding />
      
      <Button
        onClick={handleComplete}
        className="w-full mt-6"
        disabled={isButtonDisabled}
      >
        {isSubmitting ? 'Completing...' : 'Complete Onboarding'} <Check className="ml-2" />
      </Button>
    </div>
  );
};

export default PaymentStep;
