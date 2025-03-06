
import React from 'react';
import { StripeAccount } from '@/hooks/useStripeConnect';
import StripeAccountStatus from './StripeAccountStatus';
import StripeAccountCreation from './StripeAccountCreation';
import StripeOnboardingRedirect from './StripeOnboardingRedirect';

interface StripeOnboardingContentProps {
  loading: boolean;
  hasStripeAccount: boolean;
  stripeAccount: StripeAccount | null;
  isOnboarded: boolean;
  refreshAccount: () => Promise<void>;
  getOnboardingLink: (returnUrl: string) => Promise<string | null>;
}

export function StripeOnboardingContent({
  loading,
  hasStripeAccount,
  stripeAccount,
  isOnboarded,
  refreshAccount,
  getOnboardingLink,
}: StripeOnboardingContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin h-6 w-6 text-white/60 border-2 border-white/60 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!hasStripeAccount) {
    return <StripeAccountCreation refreshAccount={refreshAccount} />;
  }

  if (!isOnboarded) {
    return (
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
    );
  }

  return (
    <StripeAccountStatus 
      stripeAccount={stripeAccount}
      refreshAccount={refreshAccount}
      isOnboarded={isOnboarded}
    />
  );
}

export default StripeOnboardingContent;
