
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';

interface TermsStepProps {
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
  signature: string;
  setSignature: (signature: string) => void;
  onContinue: () => void;
}

const TermsStep = ({ 
  termsAgreed, 
  setTermsAgreed, 
  signature, 
  setSignature, 
  onContinue 
}: TermsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-4 rounded-lg border border-white/10 max-h-60 overflow-y-auto">
        <h3 className="font-semibold text-white mb-2">Terms of Service</h3>
        <div className="text-sm text-white/80">
          <p>By accepting these Terms of Service, you agree to comply with the platform guidelines, content standards, and payment terms. Your content must not violate any laws or infringe on third-party rights. The platform reserves the right to remove content that violates these terms. You retain ownership of your content but grant the platform a license to use, display, and distribute it. Payment processing is subject to Stripe's terms and conditions.</p>
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
          onClick={onContinue}
          disabled={!termsAgreed || !signature}
          className="w-full"
        >
          Continue <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TermsStep;
