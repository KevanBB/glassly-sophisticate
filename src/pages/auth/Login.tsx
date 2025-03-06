
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import AuthCard from '@/components/auth/AuthCard';

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gunmetal to-dark p-4">
      <AuthCard title="Welcome Back" subtitle="Sign in to your account">
        <LoginForm />
      </AuthCard>
    </div>
  );
};
