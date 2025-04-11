
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { isAuthenticated } from './integrations/supabase';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AstrologersPage from "./pages/AstrologersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import HoroscopePage from "./pages/HoroscopePage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
    };
    checkAuth();
  }, []);

  if (isAuth === null) return null; // Loading state
  return isAuth ? <>{children}</> : <Navigate to="/login" />;
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

const App = () => (
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
