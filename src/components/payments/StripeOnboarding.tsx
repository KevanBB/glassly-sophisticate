
import React, { useState, useEffect } from 'react';
import { useStripeConnectContext } from './StripeConnectProvider';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ExternalLink, RefreshCw, XCircle } from 'lucide-react';
import StripeOAuthConnect from './StripeOAuthConnect';

export function StripeOnboarding() {
  const { 
    hasStripeAccount, 
    stripeAccount, 
    isOnboarded, 
    loading, 
    refreshAccount, 
    getOnboardingLink 
  } = useStripeConnectContext();
  const { createStripeAccount } = useStripeConnect();
  const [isCreating, setIsCreating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  const handleCompleteOnboarding = async () => {
    setIsRedirecting(true);
    try {
      // Use full URL for return path to ensure proper redirection
      const currentUrl = window.location.href;
      const baseUrl = window.location.origin;
      const returnUrl = currentUrl.includes('/onboarding') 
        ? currentUrl 
        : `${baseUrl}/creator/onboarding?step=4`;
      
      const onboardingUrl = await getOnboardingLink(returnUrl);
      
      if (onboardingUrl) {
        // Store current path in sessionStorage for return reference
        sessionStorage.setItem('stripeReturnPath', window.location.pathname);
        window.location.href = onboardingUrl;
      } else {
        throw new Error('Failed to generate onboarding link');
      }
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      toast.error('Failed to redirect to Stripe');
      setIsRedirecting(false);
    }
  };

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('success') === 'true') {
      toast.success('Onboarding completed successfully!');
      refreshAccount();
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.toString());
      
      // Get stored return path (if any)
      const returnPath = sessionStorage.getItem('stripeReturnPath');
      if (returnPath && returnPath !== window.location.pathname) {
        // Slight delay to allow state changes to complete
        setTimeout(() => {
          window.location.pathname = returnPath;
        }, 1000);
      }
    }
    
    if (params.get('refresh') === 'true') {
      refreshAccount();
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('refresh');
      window.history.replaceState({}, '', url.toString());
    }
  }, [refreshAccount]);

  return (
    <div className="bg-gunmetal/30 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Payment Processing</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="animate-spin h-6 w-6 text-white/60" />
        </div>
      ) : !hasStripeAccount ? (
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
      ) : !isOnboarded ? (
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
          
          <Button 
            onClick={handleCompleteOnboarding} 
            disabled={isRedirecting}
            className="w-full"
          >
            {isRedirecting ? 'Redirecting...' : 'Complete Stripe Onboarding'}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default StripeOnboarding;
