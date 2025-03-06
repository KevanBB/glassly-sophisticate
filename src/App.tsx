
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Index from './pages/Index';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/Admin';
import { Toaster } from '@/components/ui/sonner';
import { CreatorApplicationForm } from './components/creator/CreatorApplicationForm';
import CreatorOnboarding from './pages/creator/CreatorOnboarding';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeConnectProvider } from './components/payments/StripeConnectProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator-application" 
              element={
                <ProtectedRoute>
                  <CreatorApplicationForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/onboarding" 
              element={
                <ProtectedRoute>
                  <CreatorOnboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/dashboard" 
              element={
                <ProtectedRoute>
                  <CreatorDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
