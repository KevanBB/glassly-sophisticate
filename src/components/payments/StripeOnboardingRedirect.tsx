import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface StripeOnboardingRedirectProps {
  getOnboardingLink: (returnUrl: string) => Promise<string | null>;
}

export const StripeOnboardingRedirect = ({ getOnboardingLink }: StripeOnboardingRedirectProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCompleteOnboarding = async () => {
    setIsRedirecting(true);
    try {
      // Use full URL for return path to ensure proper redirection
      const currentUrl = window.location.href;
      const baseUrl = window.location.origin;
      
      // If we're in the onboarding process, use the current URL as the return URL
      // Otherwise, redirect to the onboarding step 4
      const returnUrl = currentUrl.includes('/onboarding') 
        ? `${baseUrl}/creator/onboarding?step=4&refresh=true` 
        : `${baseUrl}/creator/dashboard?refresh=true`;
      
      console.log('Generating onboarding link with returnUrl:', returnUrl);
      const onboardingUrl = await getOnboardingLink(returnUrl);
      
      if (!onboardingUrl) {
        throw new Error('Failed to generate onboarding link');
      }
      
      // Store current path in sessionStorage for return reference
      sessionStorage.setItem('stripeReturnPath', window.location.pathname);
      console.log('Redirecting to Stripe onboarding URL:', onboardingUrl);
      window.location.href = onboardingUrl;
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      toast.error('Failed to redirect to Stripe');
      setIsRedirecting(false);
    }
  };

  return (
    <Button 
      onClick={handleCompleteOnboarding} 
      disabled={isRedirecting}
      className="w-full"
    >
      {isRedirecting ? 'Redirecting...' : 'Complete Stripe Onboarding'}
      <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default StripeOnboardingRedirect;
