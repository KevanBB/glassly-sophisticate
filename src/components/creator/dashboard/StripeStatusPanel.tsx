
import React from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useStripeConnectContext } from '@/components/payments/StripeConnectProvider';

const StripeStatusPanel = () => {
  const { isOnboarded, refreshAccount, loading } = useStripeConnectContext();
  
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
          <div className={`h-3 w-3 rounded-full mr-2 ${isOnboarded ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-white">
            {isOnboarded ? 'Stripe account active' : 'Stripe setup incomplete'}
          </span>
        </div>
        
        {!isOnboarded && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/creator/onboarding?step=4'}
            className="mt-2"
          >
            Complete Setup
          </Button>
        )}
      </div>
    </GlassPanel>
  );
};

export default StripeStatusPanel;
