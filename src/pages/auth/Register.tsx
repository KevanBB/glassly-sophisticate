
import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthCard } from '@/components/auth/AuthCard';

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gunmetal to-dark p-4">
      <AuthCard>
        <RegisterForm />
      </AuthCard>
    </div>
  );
};
