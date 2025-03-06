
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UsernameStepProps {
  username: string;
  setUsername: (username: string) => void;
  onContinue: () => void;
}

const UsernameStep = ({ username, setUsername, onContinue }: UsernameStepProps) => {
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  useEffect(() => {
    const checkUsername = async (value: string) => {
      if (value.length < 3) {
        setIsUsernameAvailable(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('creator_username')
          .eq('creator_username', value)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking username:', error);
          return;
        }

        setIsUsernameAvailable(!data);
      } catch (error) {
        console.error('Error checking username:', error);
      }
    };

    checkUsername(username);
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setUsername(value);
  };

  return (
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
        onClick={onContinue}
        disabled={!isUsernameAvailable || !username}
        className="w-full"
      >
        Continue <ArrowRight className="ml-2" />
      </Button>
    </div>
  );
};

export default UsernameStep;
