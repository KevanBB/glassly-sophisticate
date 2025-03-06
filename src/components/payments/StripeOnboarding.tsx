
import React, { useEffect } from 'react';
import { useStripeConnectContext } from './StripeConnectProvider';
import { toast } from 'sonner';
import StripeAccountStatus from './StripeAccountStatus';
import StripeAccountCreation from './StripeAccountCreation';
import StripeOnboardingRedirect from './StripeOnboardingRedirect';
import { handleStripeUrlParams } from '@/utils/urlHelpers';

export function StripeOnboarding() {
  const { 
    hasStripeAccount, 
    stripeAccount, 
    isOnboarded, 
    loading, 
    refreshAccount, 
    getOnboardingLink 
  } = useStripeConnectContext();

  // Handle URL parameters on mount
  useEffect(() => {
    handleStripeUrlParams(refreshAccount);
  }, [refreshAccount]);

  return (
    <div className="bg-gunmetal/30 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Payment Processing</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin h-6 w-6 text-white/60 border-2 border-white/60 border-t-transparent rounded-full"></div>
        </div>
      ) : !hasStripeAccount ? (
        <StripeAccountCreation refreshAccount={refreshAccount} />
      ) : !isOnboarded ? (
        <>
          <StripeAccountStatus 
            stripeAccount={stripeAccount}
            refreshAccount={refreshAccount}
            isOnboarded={isOnboarded}
          />
          <div className="mt-4">
            <StripeOnboardingRedirect getOnboardingLink={getOnboardingLink} />
          </div>
        </>
      ) : (
        <StripeAccountStatus 
          stripeAccount={stripeAccount}
          refreshAccount={refreshAccount}
          isOnboarded={isOnboarded}
        />
      )}
    </div>
  );
}

export default StripeOnboarding;
