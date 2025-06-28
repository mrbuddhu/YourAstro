import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AstrologersPage from "./pages/AstrologersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import HoroscopePage from "./pages/HoroscopePage";
import WalletPage from "./pages/WalletPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import AstrologerProfilePage from "./pages/AstrologerProfilePage";
import * as React from 'react';
import { useAuth } from './hooks/useAuth';

console.log('App.tsx is being loaded');

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  console.log('App component is rendering');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Toast notifications */}
          <Toaster />
          <Sonner position="top-right" closeButton theme="light" />
          
          {/* Application Routes */}
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/astrologers" element={<AstrologersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/chat/:astrologerId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/call/:astrologerId" element={<ProtectedRoute><CallPage /></ProtectedRoute>} />
              <Route path="/horoscope" element={<HoroscopePage />} />
              <Route path="/wallet/add-funds" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/astrologer/:astrologerId" element={<AstrologerProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
