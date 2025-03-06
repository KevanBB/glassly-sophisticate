
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface StripeAccount {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  capabilities: {
    card_payments: string;
    transfers: string;
  };
}

export function useStripeConnect() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callStripeFunction = async (action: string, data: any = {}) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }

      const response = await supabase.functions.invoke('stripe-connect', {
        body: { action, ...data },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error calling Stripe function');
      }

      return response.data;
    } catch (err) {
      console.error('Stripe Connect Error:', err);
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createStripeAccount = async (country: string = 'US') => {
    return callStripeFunction('create_account', { country });
  };

  const updateStripeAccount = async (accountId: string, data: any) => {
    return callStripeFunction('update_account', { accountId, ...data });
  };

  const createManagedAccount = async (country: string = 'US') => {
    return callStripeFunction('create_managed_account', { country });
  };

  const getOnboardingLink = async (returnUrl: string) => {
    const result = await callStripeFunction('create_onboarding_link', { returnUrl });
    return result?.url;
  };

  const getOAuthLink = async (returnUrl: string) => {
    const result = await callStripeFunction('create_oauth_link', { returnUrl });
    return result?.url;
  };

  const getAccountStatus = async () => {
    const result = await callStripeFunction('get_account_status');
    return result?.account as StripeAccount;
  };

  const createPaymentIntent = async (amount: number, creatorId: string, tributeType: string = 'standard') => {
    const result = await callStripeFunction('create_payment_intent', { 
      amount, 
      creatorId,
      tributeType 
    });
    return result?.clientSecret;
  };

  const handleOAuthCallback = async (code: string) => {
    return callStripeFunction('handle_oauth_callback', { code });
  };

  return {
    loading,
    error,
    createStripeAccount,
    updateStripeAccount,
    createManagedAccount,
    getOnboardingLink,
    getOAuthLink,
    getAccountStatus,
    createPaymentIntent,
    handleOAuthCallback
  };
}
