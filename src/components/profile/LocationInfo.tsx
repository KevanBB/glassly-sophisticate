import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassPanel from '@/components/ui/GlassPanel';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, User, Heart } from 'lucide-react';

interface LocationInfoProps {
  profile?: any; // Added profile prop
  editing: boolean;
  formData: {
    location: string;
    age: string;
    gender: string;
    orientation: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationInfo = ({ profile, editing, formData, handleChange }: LocationInfoProps) => {
  return (
    <GlassPanel className="p-6 space-y-4">
      <h3 className="text-lg font-medium text-white">Demographics</h3>
      <Separator className="bg-white/10" />
      
      {!editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.location && (
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Location</p>
                <p className="text-white font-medium">{formData.location}</p>
              </div>
            </div>
          )}
          
          {formData.age && (
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Age</p>
                <p className="text-white font-medium">{formData.age}</p>
              </div>
            </div>
          )}
          
          {formData.gender && (
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Gender</p>
                <p className="text-white font-medium">{formData.gender}</p>
              </div>
            </div>
          )}
          
          {formData.orientation && (
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Heart size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Orientation</p>
                <p className="text-white font-medium">{formData.orientation}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white/80">Location</Label>
              <Input 
                id="location" 
                name="location"
                value={formData.location} 
                onChange={handleChange}
                placeholder="City, Country"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="text-white/80">Age</Label>
              <Input 
                id="age" 
                name="age"
                value={formData.age} 
                onChange={handleChange}
                type="number"
                min="18"
                max="120"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white/80">Gender</Label>
              <Input 
                id="gender" 
                name="gender"
                value={formData.gender} 
                onChange={handleChange}
                placeholder="Your gender"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orientation" className="text-white/80">Sexual Orientation</Label>
              <Input 
                id="orientation" 
                name="orientation"
                value={formData.orientation} 
                onChange={handleChange}
                placeholder="Your orientation"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

export default LocationInfo;
