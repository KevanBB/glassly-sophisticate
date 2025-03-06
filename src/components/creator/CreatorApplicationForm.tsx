
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export const CreatorApplicationForm = () => {
  const { user } = useAuth();
  const profile = useUserProfile(user);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    legalFirstName: '',
    legalMiddleName: '',
    legalLastName: '',
    birthday: '',
    address: '',
    idFrontFile: null as File | null,
    idBackFile: null as File | null,
    idSelfieFile: null as File | null,
    termsAgreed: false,
    signature: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idFrontFile' | 'idBackFile' | 'idSelfieFile') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const uploadFile = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${user!.id}/${prefix}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('id_verification')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Error uploading ${prefix}: ${uploadError.message}`);
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload ID verification images
      const [idFrontUrl, idBackUrl, idSelfieUrl] = await Promise.all([
        uploadFile(formData.idFrontFile!, 'id-front'),
        uploadFile(formData.idBackFile!, 'id-back'),
        uploadFile(formData.idSelfieFile!, 'id-selfie'),
      ]);

      // Submit application
      const { error } = await supabase.from('creator_applications').insert({
        user_id: user.id,
        display_name: profile.display_name,
        email: user.email,
        legal_first_name: formData.legalFirstName,
        legal_middle_name: formData.legalMiddleName,
        legal_last_name: formData.legalLastName,
        birthday: formData.birthday,
        address: formData.address,
        id_front_url: idFrontUrl,
        id_back_url: idBackUrl,
        id_selfie_url: idSelfieUrl,
        terms_agreed: formData.termsAgreed,
        signature: formData.signature,
        signature_date: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your creator application has been submitted successfully!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Creator Application</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="legalFirstName">Legal First Name</Label>
          <Input
            id="legalFirstName"
            value={formData.legalFirstName}
            onChange={e => setFormData(prev => ({ ...prev, legalFirstName: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="legalMiddleName">Legal Middle Name (Optional)</Label>
          <Input
            id="legalMiddleName"
            value={formData.legalMiddleName}
            onChange={e => setFormData(prev => ({ ...prev, legalMiddleName: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="legalLastName">Legal Last Name</Label>
          <Input
            id="legalLastName"
            value={formData.legalLastName}
            onChange={e => setFormData(prev => ({ ...prev, legalLastName: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthday">Birthday</Label>
          <Input
            id="birthday"
            type="date"
            value={formData.birthday}
            onChange={e => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Full Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="idFront">ID Front View</Label>
          <Input
            id="idFront"
            type="file"
            accept="image/*"
            onChange={e => handleFileChange(e, 'idFrontFile')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idBack">ID Back View</Label>
          <Input
            id="idBack"
            type="file"
            accept="image/*"
            onChange={e => handleFileChange(e, 'idBackFile')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idSelfie">Selfie with ID</Label>
          <Input
            id="idSelfie"
            type="file"
            accept="image/*"
            onChange={e => handleFileChange(e, 'idSelfieFile')}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAgreed}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, termsAgreed: checked as boolean }))
            }
            required
          />
          <Label htmlFor="terms">
            I agree to the Terms of Service
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature">Digital Signature (Full Name)</Label>
          <Input
            id="signature"
            value={formData.signature}
            onChange={e => setFormData(prev => ({ ...prev, signature: e.target.value }))}
            placeholder="Type your full legal name"
            required
          />
          <p className="text-sm text-gray-400">
            Date: {format(new Date(), 'PPP')}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
        <Button type="submit" variant="crimson">
          Submit Application
        </Button>
      </div>
    </form>
  );
};
