
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onContinue: () => void;
}

const WelcomeStep = ({ onContinue }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Congratulations! 🎉</h2>
        <p className="text-white/80 mb-4">
          Your creator application has been approved! We're excited to have you join our
          community of creators. Before you can start creating content, we need to
          set up a few things.
        </p>
        <Button
          onClick={onContinue}
          className="w-full"
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
