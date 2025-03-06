
import React, { useState, useEffect } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useStripeConnectContext } from '@/components/payments/StripeConnectProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StripeStatusPanel = () => {
  const { isOnboarded, hasStripeAccount, refreshAccount, loading, getOnboardingLink } = useStripeConnectContext();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('refresh') === 'true') {
      refreshAccount();
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('refresh');
      window.history.replaceState({}, '', url.toString());
    }
  }, [refreshAccount]);
  
  const handleCompleteSetup = async () => {
    if (!hasStripeAccount) {
      navigate('/creator/onboarding?step=4');
      return;
    }
    
    // Account exists but not fully onboarded, redirect to Stripe onboarding
    setIsRedirecting(true);
    try {
      const returnUrl = `${window.location.origin}/creator/dashboard?refresh=true`;
      console.log('Generating onboarding link with returnUrl:', returnUrl);
      const onboardingUrl = await getOnboardingLink(returnUrl);
      
      if (!onboardingUrl) {
        throw new Error('Failed to generate onboarding link');
      }
      
      // Store current path in sessionStorage for return reference
      sessionStorage.setItem('stripeReturnPath', '/creator/dashboard');
      console.log('Redirecting to Stripe onboarding URL:', onboardingUrl);
      window.location.href = onboardingUrl;
    } catch (error) {
      console.error('Error redirecting to Stripe onboarding:', error);
      toast.error('Failed to redirect to Stripe');
      setIsRedirecting(false);
    }
  };
  
  return (
    <GlassPanel className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Payment Status</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={refreshAccount}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isOnboarded ? 'bg-green-500' : hasStripeAccount ? 'bg-yellow-500' : 'bg-red-500'}`} />
          <span className="text-white">
            {isOnboarded 
              ? 'Stripe account active' 
              : hasStripeAccount 
                ? 'Stripe setup incomplete' 
                : 'Stripe not connected'}
          </span>
        </div>
        
        {!isOnboarded && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCompleteSetup}
            disabled={isRedirecting || loading}
            className="mt-2"
          >
            {isRedirecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                Complete Setup
                {hasStripeAccount && <ExternalLink className="ml-2 h-4 w-4" />}
              </>
            )}
          </Button>
        )}
      </div>
    </GlassPanel>
  );
};

export default StripeStatusPanel;
