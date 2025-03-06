import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStripeConnect, StripeAccount } from '@/hooks/useStripeConnect';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface StripeConnectContextType {
  hasStripeAccount: boolean;
  stripeAccountId: string | null;
  stripeAccount: StripeAccount | null;
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
  getOnboardingLink: (returnUrl: string) => Promise<string | null>;
}

const StripeConnectContext = createContext<StripeConnectContextType | undefined>(undefined);

export function StripeConnectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const profile = useUserProfile(user);
  const { getAccountStatus, getOnboardingLink: getLink, loading: stripeLoading, error: stripeError } = useStripeConnect();
  
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.stripe_account_id) {
      setStripeAccountId(profile.stripe_account_id);
      refreshAccount();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const refreshAccount = async () => {
    if (!profile?.stripe_account_id) {
      setStripeAccount(null);
      return;
    }

    setLoading(true);
    try {
      const account = await getAccountStatus();
      if (account) {
        setStripeAccount(account);
      }
    } catch (err) {
      console.error('Error refreshing Stripe account:', err);
      setError('Failed to load Stripe account information');
      toast.error('Failed to load Stripe account information');
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingLink = async (returnUrl: string): Promise<string | null> => {
    try {
      return await getLink(returnUrl);
    } catch (err) {
      console.error('Error getting onboarding link:', err);
      setError('Failed to get onboarding link');
      toast.error('Failed to get onboarding link');
      return null;
    }
  };

  const isOnboarded = !!(
    stripeAccount && 
    stripeAccount.details_submitted && 
    stripeAccount.charges_enabled && 
    stripeAccount.payouts_enabled &&
    stripeAccount.capabilities?.card_payments === 'active' &&
    stripeAccount.capabilities?.transfers === 'active'
  );

  return (
    <StripeConnectContext.Provider
      value={{
        hasStripeAccount: !!stripeAccountId,
        stripeAccountId,
        stripeAccount,
        isOnboarded,
        loading: loading || stripeLoading,
        error: error || stripeError,
        refreshAccount,
        getOnboardingLink,
      }}
    >
      {children}
    </StripeConnectContext.Provider>
  );
}

export function useStripeConnectContext() {
  const context = useContext(StripeConnectContext);
  if (context === undefined) {
    throw new Error('useStripeConnectContext must be used within a StripeConnectProvider');
  }
  return context;
}
