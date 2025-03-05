
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

const TributeActions = () => {
  const [showTributeForm, setShowTributeForm] = useState(false);

  const handleFabClick = () => {
    setShowTributeForm(true);
    toast('Quick tribute activated', {
      description: 'Send a tribute to your favorite domme',
    });
  };

  const fabSubActions = [
    { 
      icon: <DollarSign size={16} />, 
      label: 'Quick $20 Tribute', 
      color: 'text-white', 
      onClick: () => {
        toast.success('Quick $20 tribute sent!');
      }
    },
    { 
      icon: <DollarSign size={16} />, 
      label: 'Custom Tribute', 
      color: 'text-white', 
      onClick: () => setShowTributeForm(true)
    },
  ];

  return (
    <FloatingActionButton 
      icon={<DollarSign size={24} />}
      onClick={handleFabClick}
      position="bottom-right"
      subActions={fabSubActions}
    />
  );
};

export default TributeActions;
