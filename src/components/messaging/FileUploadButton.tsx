
import React, { useState } from 'react';
import { Image, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { uploadMediaMessage } from './utils/messageUtils';
import type { Contact } from '@/types/messaging';

interface FileUploadButtonProps {
  user: any;
  contact: Contact;
  isSelfDestruct: boolean;
  destructTime: number;
  setIsSelfDestruct: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ 
  user, 
  contact, 
  isSelfDestruct, 
  destructTime,
  setIsSelfDestruct
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !contact) return;
    
    setIsUploading(true);
    
    try {
      await uploadMediaMessage(file, user, contact, isSelfDestruct, destructTime);
      
      toast({
        title: "File uploaded",
        description: "Your file has been sent successfully.",
      });
      
      setIsSelfDestruct(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "There was a problem sending your file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        onChange={handleFileUpload} 
      />
      <label 
        htmlFor="file-upload" 
        className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
      >
        {isUploading ? (
          <Upload size={20} className="animate-pulse" />
        ) : (
          <Image size={20} />
        )}
      </label>
    </>
  );
};

export default FileUploadButton;
