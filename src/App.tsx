
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CropsPage from "./pages/CropsPage";
import CropDetailPage from "./pages/CropDetailPage";
import WeatherPage from "./pages/WeatherPage";
import MobileDashboardPage from "./pages/MobileDashboardPage";
import SoilHealthPage from "./pages/SoilHealthPage";
import FarmingCalendarPage from "./pages/FarmingCalendarPage";
import CommunityPage from "./pages/CommunityPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useIsMobile } from "./hooks/use-mobile";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Use a state to track if we're in a browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  // Initialize isMobile only after component mount
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    setIsBrowser(true);
    // Now that we're on the client, we can safely determine if we're on mobile
    const isMobile = window.innerWidth < 768;
    setIsMobileView(isMobile);
    
    // Set up a listener for resize events
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    {isBrowser && (isMobileView ? <MobileDashboardPage /> : <DashboardPage />)}
                  </ProtectedRoute>
                } />
                <Route path="/crops" element={<ProtectedRoute><CropsPage /></ProtectedRoute>} />
                <Route path="/crops/:cropId" element={<ProtectedRoute><CropDetailPage /></ProtectedRoute>} />
                <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
                <Route path="/soil" element={<ProtectedRoute><SoilHealthPage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><FarmingCalendarPage /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
