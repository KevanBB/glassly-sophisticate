
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { Plus } from 'lucide-react';

interface PersonaSelectorProps {
  currentPersona: string;
  editing: boolean;
  onPersonaChange: (persona: string) => void;
}

const PersonaSelector = ({ currentPersona, editing, onPersonaChange }: PersonaSelectorProps) => {
  return (
    <GlassPanel className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Personas</h3>
        {editing && (
          <Button variant="outline" size="sm" className="border-white/20 text-white">
            <Plus size={14} className="mr-1" /> Create Persona
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <GlassPanel 
          intensity="light"
          className={`p-3 cursor-pointer ${currentPersona === "default" ? "border-brand" : ""}`}
          onClick={() => onPersonaChange("default")}
        >
          <div className="flex items-center space-x-3">
            <User size={18} className="text-white/70" />
            <div>
              <p className="text-sm font-medium text-white">Default</p>
              <p className="text-xs text-white/60">Primary Persona</p>
            </div>
          </div>
        </GlassPanel>
        
        <GlassPanel 
          intensity="light"
          className={`p-3 cursor-pointer ${currentPersona === "public" ? "border-brand" : ""}`}
          onClick={() => onPersonaChange("public")}
        >
          <div className="flex items-center space-x-3">
            <User size={18} className="text-white/70" />
            <div>
              <p className="text-sm font-medium text-white">Public</p>
              <p className="text-xs text-white/60">Limited Visibility</p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </GlassPanel>
  );
};

export default PersonaSelector;
