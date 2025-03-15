
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleColors } from '@/hooks/useRoleColors';

interface RolePreferencesProps {
  profile?: any; // Added profile prop
  role: string;
  experienceLevel: string;
  editing: boolean;
  onRoleChange: (value: string) => void;
  onExperienceLevelChange: (value: string) => void;
}

const RolePreferences = ({ 
  profile,
  role, 
  experienceLevel, 
  editing, 
  onRoleChange, 
  onExperienceLevelChange 
}: RolePreferencesProps) => {
  const { getRoleColor } = useRoleColors();
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="role" className="text-white/80">Primary Role</Label>
        <Select 
          disabled={!editing}
          value={role}
          onValueChange={onRoleChange}
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
          <Badge className={`${getRoleColor(role)} text-white`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="experienceLevel" className="text-white/80">Experience Level</Label>
        <Select 
          disabled={!editing}
          value={experienceLevel}
          onValueChange={onExperienceLevelChange}
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
    </>
  );
};

export default RolePreferences;
