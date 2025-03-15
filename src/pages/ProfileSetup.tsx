
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useRoleColors } from '@/hooks/useRoleColors';

const ProfileSetup = () => {
  const { user, profile, isNewUser, setIsNewUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { getRoleColor } = useRoleColors();
  
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || '',
    bio: profile?.bio || '',
    role: profile?.role || 'switch',
    experienceLevel: profile?.experience_level || 'curious',
    kinksFetishes: profile?.kinks_fetishes || [],
    location: profile?.location || '',
    userNumber: profile?.user_number || 0
  });
  
  const steps = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'basic', title: 'Basics' },
    { id: 'role', title: 'Role' },
    { id: 'complete', title: 'Complete' }
  ];

  useEffect(() => {
    // If not a new user and has already set up profile, redirect to dashboard
    if (!isNewUser && profile?.display_name && profile?.role) {
      navigate('/dashboard');
    }
    
    // Update form data if profile is loaded
    if (profile) {
      setFormData({
        displayName: profile.display_name || '',
        bio: profile.bio || '',
        role: profile.role || 'switch',
        experienceLevel: profile.experience_level || 'curious',
        kinksFetishes: profile.kinks_fetishes || [],
        location: profile.location || '',
        userNumber: profile.user_number || 0
      });
    }
  }, [profile, isNewUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          role: formData.role,
          experience_level: formData.experienceLevel,
          location: formData.location
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile setup complete!');
      setIsNewUser(false);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-dark-200 to-dark"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Set Up Your Profile</h1>
          <p className="text-white/70">Customize your experience on SubSpace</p>
        </div>
        
        <div className="mb-8">
          <Stepper 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
          />
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-xl">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white">Welcome to SubSpace!</h2>
                <p className="text-white/70 mt-2">
                  You are member #{formData.userNumber}! Let's set up your profile to help you connect with others in the community.
                </p>
                
                <div className="mt-6 p-4 bg-brand/10 rounded-lg border border-brand/20">
                  <p className="text-white text-sm">
                    This information helps personalize your experience and connect you with like-minded individuals. You can always update it later from your profile page.
                  </p>
                </div>
              </div>
              
              <Button onClick={nextStep} className="w-full">
                Let's Get Started
              </Button>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="How you want to be known"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others about yourself..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State/Province, Country"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Role & Experience</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Primary Role</Label>
                  <Select 
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dominant">Dominant</SelectItem>
                      <SelectItem value="submissive">Submissive</SelectItem>
                      <SelectItem value="switch">Switch</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-2">
                    <Badge className={`${getRoleColor(formData.role)} text-white`}>
                      {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select 
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curious">Curious</SelectItem>
                      <SelectItem value="novice">Novice</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="experienced">Experienced</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">Profile Setup Complete!</h2>
                <p className="text-white/70 mt-2">
                  Your profile has been created. You can always update it later from your profile page.
                </p>
                
                <div className="mt-8 p-4 bg-brand/10 rounded-lg border border-brand/20">
                  <h3 className="text-white font-medium">Your profile summary:</h3>
                  <ul className="mt-2 space-y-2 text-left">
                    <li className="text-white/80">Display Name: <span className="text-white">{formData.displayName}</span></li>
                    <li className="text-white/80">Role: <span className="text-white">{formData.role}</span></li>
                    <li className="text-white/80">Experience Level: <span className="text-white">{formData.experienceLevel}</span></li>
                    <li className="text-white/80">Member #: <span className="text-white">{formData.userNumber}</span></li>
                  </ul>
                </div>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                Finish & Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSetup;
