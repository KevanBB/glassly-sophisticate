
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import StripeOnboarding from '@/components/payments/StripeOnboarding';

interface PaymentStepProps {
  onComplete: () => void;
}

const PaymentStep = ({ onComplete }: PaymentStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Payment Processing Setup</h2>
      <p className="text-white/80 mb-4">
        To receive payments from your subscribers and tips, you need to connect your SubSpace account to Stripe.
      </p>
      
      <StripeOnboarding />
      
      <Button
        onClick={onComplete}
        className="w-full mt-6"
      >
        Complete Onboarding <Check className="ml-2" />
      </Button>
    </div>
  );
};

export default PaymentStep;
