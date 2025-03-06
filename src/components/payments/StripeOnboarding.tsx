
import React, { useEffect } from 'react';
import { useStripeConnectContext } from './StripeConnectProvider';
import StripeOnboardingContent from './StripeOnboardingContent';
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
      
      <StripeOnboardingContent 
        loading={loading}
        hasStripeAccount={hasStripeAccount}
        stripeAccount={stripeAccount}
        isOnboarded={isOnboarded}
        refreshAccount={refreshAccount}
        getOnboardingLink={getOnboardingLink}
      />
    </div>
  );
}

export default StripeOnboarding;
