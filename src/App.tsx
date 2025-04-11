
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

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();

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
                    {isMobile ? <MobileDashboardPage /> : <DashboardPage />}
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
