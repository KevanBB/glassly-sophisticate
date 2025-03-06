
import React, { useState } from 'react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PaymentProcessorProps {
  creatorId: string;
  amount: number;
  tributeType?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentProcessor({
  creatorId,
  amount,
  tributeType = 'standard',
  onSuccess,
  onError
}: PaymentProcessorProps) {
  const { user } = useAuth();
  const { createPaymentIntent, loading, error } = useStripeConnect();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error('You must be logged in to make a payment');
      onError?.('User not authenticated');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      onError?.('Invalid amount');
      return;
    }

    setIsProcessing(true);
    try {
      // For this demo, we'll simulate a successful payment
      // In a real implementation, you would use Stripe Elements to collect
      // card details and confirm the payment intent
      
      const clientSecret = await createPaymentIntent(
        amount * 100, // Convert to cents
        creatorId,
        tributeType
      );

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Simulate payment confirmation
      // In a real app, you would use stripe.confirmCardPayment()
      setTimeout(() => {
        toast.success(`Payment of $${amount} processed successfully!`);
        onSuccess?.();
        setIsProcessing(false);
      }, 1500);
      
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed: ' + (err.message || 'Unknown error'));
      onError?.(err.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/90">{error}</p>
        </div>
      )}
      
      <Button
        onClick={handlePayment}
        disabled={isProcessing || loading}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <DollarSign className="h-5 w-5 mr-1" />
            Pay ${amount}
          </>
        )}
      </Button>
    </div>
  );
}

export default PaymentProcessor;
