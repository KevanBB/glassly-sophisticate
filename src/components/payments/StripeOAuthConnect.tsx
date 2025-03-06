
import React, { useState, useEffect } from 'react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function StripeOAuthConnect() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { getOAuthLink, handleOAuthCallback, loading } = useStripeConnect();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle OAuth callback from Stripe
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        try {
          const result = await handleOAuthCallback(code);
          
          if (result?.success) {
            toast.success('Your Stripe account has been connected successfully!');
            
            // Clean up URL parameters
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, '', url.toString());
            
            // Refresh the page to update account status
            window.location.href = window.location.href + '?refresh=true';
          } else {
            throw new Error('Failed to connect Stripe account');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('Failed to connect your Stripe account');
        }
      }
    };

    if (location.search.includes('code=')) {
      handleCallback();
    }
  }, [location, handleOAuthCallback]);

  const handleConnectStripe = async () => {
    setIsRedirecting(true);
    try {
      // Use the current URL as the return URL
      const returnUrl = window.location.href;
      const oauthUrl = await getOAuthLink(returnUrl);
      
      if (oauthUrl) {
        window.location.href = oauthUrl;
      } else {
        throw new Error('Failed to generate OAuth link');
      }
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      toast.error('Failed to redirect to Stripe');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-white/70">
        Connect your existing Stripe account or create a new one to receive payments from users.
      </p>
      <Button 
        onClick={handleConnectStripe} 
        disabled={isRedirecting || loading}
        className="w-full"
      >
        {isRedirecting ? (
          <>
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            Redirecting to Stripe...
          </>
        ) : (
          <>
            Connect with Stripe
            <ExternalLink className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

export default StripeOAuthConnect;
