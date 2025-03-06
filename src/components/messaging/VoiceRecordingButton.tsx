
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { uploadMediaMessage } from './utils/messageUtils';
import type { Contact } from '@/types/messaging';

interface VoiceRecordingButtonProps {
  user: any;
  contact: Contact;
  isSelfDestruct: boolean;
  destructTime: number;
  setIsSelfDestruct: React.Dispatch<React.SetStateAction<boolean>>;
}

const VoiceRecordingButton: React.FC<VoiceRecordingButtonProps> = ({
  user,
  contact,
  isSelfDestruct,
  destructTime,
  setIsSelfDestruct
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        try {
          // Convert Blob to File
          const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { 
            type: 'audio/webm',
            lastModified: Date.now()
          });
          
          await uploadMediaMessage(audioFile, user, contact, isSelfDestruct, destructTime);
          
          toast({
            title: "Voice message sent",
            description: "Your voice message has been sent successfully.",
          });
          
          setIsSelfDestruct(false);
        } catch (error) {
          console.error('Error sending voice message:', error);
          toast({
            title: "Error sending voice message",
            description: "There was a problem sending your voice message.",
            variant: "destructive"
          });
        }
        
        // Clear the chunks for next recording
        setAudioChunks([]);
      };
      
      setRecorder(mediaRecorder);
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (recorder && isRecording) {
      recorder.stop();
      setIsRecording(false);
      // Stop all audio tracks
      recorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
        isRecording ? 'text-red-500 animate-pulse' : 'text-white/70 hover:text-white'
      }`}
    >
      <Mic size={20} />
    </button>
  );
};

export default VoiceRecordingButton;
