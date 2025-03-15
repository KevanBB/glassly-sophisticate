
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import CreatorProfile from './pages/creator/CreatorProfile';
import CreatePost from './pages/creator/CreatePost';
import MessagesPage from './pages/Messages';
import CommunityPage from './pages/Community';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeConnectProvider } from './components/payments/StripeConnectProvider';
import UserProfile from './pages/UserProfile';
import ProfileSetup from './pages/ProfileSetup';

const queryClient = new QueryClient();

// Wrapper component to handle new user redirects
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isNewUser, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && isNewUser && location.pathname !== '/profile/setup') {
      navigate('/profile/setup');
    }
  }, [isNewUser, loading, navigate, user, location]);

  return <>{children}</>;
};

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
              path="/profile/setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <Dashboard />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <AdminDashboard />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator-application" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <CreatorApplicationForm />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/onboarding" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <CreatorOnboarding />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/dashboard" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <CreatorDashboard />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/create-post" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <CreatePost />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:username" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <CreatorProfile />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <MessagesPage />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <CommunityPage />
                  </AuthRedirect>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:username" 
              element={
                <ProtectedRoute>
                  <AuthRedirect>
                    <UserProfile />
                  </AuthRedirect>
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
