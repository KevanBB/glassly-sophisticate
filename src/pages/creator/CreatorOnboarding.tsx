
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowRight, Check } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { StripeConnectProvider } from '@/components/payments/StripeConnectProvider';
import StripeOnboarding from '@/components/payments/StripeOnboarding';

const CreatorOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkCreatorStatus = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_creator, creator_onboarding_complete')
        .eq('id', user.id)
        .single();

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
    };

    checkCreatorStatus();
  }, [user, navigate]);

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setIsUsernameAvailable(false);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('creator_username')
      .eq('creator_username', value)
      .maybeSingle();

    setIsUsernameAvailable(!data);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setUsername(value);
    checkUsername(value);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
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

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          creator_username: username,
          creator_onboarding_complete: true
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('Creator onboarding completed successfully!');
      navigate(`/creator/${username}`);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  if (loading || !isCreator) {
    return null;
  }

  return (
    <StripeConnectProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-2xl space-y-6">
          <GlassPanel className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white">Welcome to Creator Onboarding</h1>
              <p className="text-white/70">Let's get your creator profile set up</p>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">Congratulations! 🎉</h2>
                  <p className="text-white/80 mb-4">
                    Your creator application has been approved! We're excited to have you join our
                    community of creators. Before you can start creating content, we need to
                    set up a few things.
                  </p>
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full"
                  >
                    Get Started <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-white">Choose your creator username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="your-username"
                    />
                    {username && (
                      <div className="absolute right-3 top-3">
                        {isUsernameAvailable ? (
                          <Check className="text-green-500 h-4 w-4" />
                        ) : (
                          <span className="text-red-500 text-sm">Not available</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mt-2">
                    This will be your unique URL: creator/{username}
                  </p>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  disabled={!isUsernameAvailable || !username}
                  className="w-full"
                >
                  Continue <ArrowRight className="ml-2" />
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 max-h-60 overflow-y-auto">
                  <h3 className="font-semibold text-white mb-2">Terms of Service</h3>
                  <div className="text-sm text-white/80">
                    {/* Add your terms of service content here */}
                    <p>Terms of Service content goes here...</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAgreed}
                      onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-white">
                      I have read and agree to the Terms of Service
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="signature" className="text-white">
                      Please type your full name as signature
                    </Label>
                    <Input
                      id="signature"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Your full name"
                    />
                  </div>

                  <Button
                    onClick={() => setStep(4)}
                    disabled={!termsAgreed || !signature}
                    className="w-full"
                  >
                    Continue <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Processing Setup</h2>
                <p className="text-white/80 mb-4">
                  To receive payments from your subscribers and tips, you need to connect your SubSpace account to Stripe.
                </p>
                
                <StripeOnboarding />
                
                <Button
                  onClick={handleSubmit}
                  className="w-full mt-6"
                >
                  Complete Onboarding <Check className="ml-2" />
                </Button>
              </div>
            )}
          </GlassPanel>
        </div>
      </motion.div>
    </StripeConnectProvider>
  );
};

export default CreatorOnboarding;
