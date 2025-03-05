import React, { useState, useRef } from 'react';
import { Edit2, Upload, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfileAvatarProps {
  avatarUrl: string;
  editing: boolean;
  userId?: string;
  onAvatarUpdate?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ProfileAvatar = ({ avatarUrl, editing, userId, onAvatarUpdate, size = 'xl' }: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setShowCropper(true);
      
      setCrop({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      });
    }
  };

  const handleCropComplete = async () => {
    if (!selectedFile || !imgRef.current || !crop.width || !crop.height || !userId) {
      toast.error("Unable to process image");
      return;
    }

    try {
      setIsUploading(true);
      
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error("Browser does not support canvas");
        return;
      }
      
      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else toast.error("Failed to process image");
        }, 'image/jpeg', 0.95);
      });
      
      const croppedFile = new File([blob], selectedFile.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      
      const fileName = `avatar-${userId}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedFile, {
          cacheControl: '3600',
          upsert: true,
        });
        
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      if (onAvatarUpdate) {
        onAvatarUpdate(publicUrlData.publicUrl);
      }
      
      toast.success("Avatar updated successfully!");
      
      setShowCropper(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      
    } catch (error: any) {
      toast.error(`Error uploading avatar: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28'
  };

  return (
    <div className="flex justify-center">
      <div className="relative group">
        {showCropper && previewUrl ? (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-200 rounded-xl p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-white">Crop Avatar</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={cancelCrop}
                  className="text-white/80 hover:text-white"
                >
                  <X size={18} />
                </Button>
              </div>
              
              <div className="mb-4 max-h-[60vh] overflow-auto">
                <ReactCrop 
                  crop={crop} 
                  onChange={c => setCrop(c)}
                  circularCrop
                  aspect={1}
                >
                  <img 
                    ref={imgRef}
                    src={previewUrl} 
                    alt="Crop preview" 
                    className="max-w-full"
                  />
                </ReactCrop>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={cancelCrop}
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCropComplete}
                  disabled={isUploading}
                  className="bg-crimson hover:bg-crimson/90 text-white"
                >
                  {isUploading ? 'Saving...' : 'Save Avatar'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${sizeClass[size]} rounded-full overflow-hidden border-4 border-crimson`}>
            <img 
              src={avatarUrl || "https://i.pravatar.cc/150?img=12"} 
              alt="Profile avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {editing && !showCropper && (
          <>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-crimson hover:bg-crimson/90 text-white rounded-full w-8 h-8"
            >
              <Edit2 size={14} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
