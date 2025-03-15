
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li 
            key={step.id} 
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}
          >
            {stepIdx < currentStep ? (
              // Completed step
              <div className="group flex items-center">
                <span className="flex items-center">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-brand flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-white">{step.title}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <div className="h-0.5 w-full bg-brand" />
                )}
              </div>
            ) : stepIdx === currentStep ? (
              // Current step
              <div className="flex items-center" aria-current="step">
                <span className="flex items-center">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full border-2 border-brand flex items-center justify-center bg-dark">
                    <span className="text-brand">{stepIdx + 1}</span>
                  </span>
                  <span className="ml-3 text-sm font-medium text-white">{step.title}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <div className="h-0.5 w-full bg-white/30" />
                )}
              </div>
            ) : (
              // Upcoming step
              <div className="group flex items-center">
                <span className="flex items-center" aria-hidden="true">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full border-2 border-white/30 flex items-center justify-center bg-dark">
                    <span className="text-white/50">{stepIdx + 1}</span>
                  </span>
                  <span className="ml-3 text-sm font-medium text-white/50">{step.title}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <div className="h-0.5 w-full bg-white/30" />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
