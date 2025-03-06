
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StripeConnectProvider } from '@/components/payments/StripeConnectProvider';

// Import step components
import OnboardingLayout from '@/components/creator/onboarding/OnboardingLayout';
import WelcomeStep from '@/components/creator/onboarding/WelcomeStep';
import UsernameStep from '@/components/creator/onboarding/UsernameStep';
import TermsStep from '@/components/creator/onboarding/TermsStep';
import PaymentStep from '@/components/creator/onboarding/PaymentStep';

const CreatorOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1');
  
  const [step, setStep] = useState(initialStep);
  const [username, setUsername] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkCreatorStatus = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_creator, creator_onboarding_complete')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          setLoading(false);
          return;
        }

        if (!profile?.is_creator) {
          navigate('/dashboard');
          return;
        }

        if (profile.creator_onboarding_complete) {
          navigate('/creator/dashboard');
          return;
        }

        setIsCreator(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking creator status:', error);
        setLoading(false);
      }
    };

    checkCreatorStatus();
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      // Insert into creator_onboarding table
      const { error: onboardingError } = await supabase
        .from('creator_onboarding')
        .insert({
          user_id: user.id,
          creator_username: username,
          terms_agreed: termsAgreed,
          terms_signature: signature,
          terms_signed_at: new Date().toISOString()
        });

      if (onboardingError) throw onboardingError;

      // Update profile with username and onboarding completion
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          creator_username: username,
          creator_onboarding_complete: true
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('Creator onboarding completed successfully!');
      navigate('/creator/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  if (!isCreator) {
    return null;
  }

  return (
    <StripeConnectProvider>
      {step === 1 && (
        <OnboardingLayout>
          <WelcomeStep onContinue={() => setStep(2)} />
        </OnboardingLayout>
      )}

      {step === 2 && (
        <OnboardingLayout 
          title="Choose Your Username" 
          subtitle="Select a unique username for your creator profile"
        >
          <UsernameStep 
            username={username} 
            setUsername={setUsername} 
            onContinue={() => setStep(3)} 
          />
        </OnboardingLayout>
      )}

      {step === 3 && (
        <OnboardingLayout
          title="Terms of Service"
          subtitle="Please review and accept our terms of service"
        >
          <TermsStep
            termsAgreed={termsAgreed}
            setTermsAgreed={setTermsAgreed}
            signature={signature}
            setSignature={setSignature}
            onContinue={() => setStep(4)}
          />
        </OnboardingLayout>
      )}

      {step === 4 && (
        <OnboardingLayout
          title="Payment Processing"
          subtitle="Set up your payment processing with Stripe"
        >
          <PaymentStep onComplete={handleSubmit} />
        </OnboardingLayout>
      )}
    </StripeConnectProvider>
  );
};

export default CreatorOnboarding;
