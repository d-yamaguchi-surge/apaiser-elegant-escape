import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminBusinessDays from "./pages/admin/AdminBusinessDays";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
          <Route path="/admin/reservations" element={<ProtectedRoute><AdminReservations /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/business-days" element={<ProtectedRoute><AdminBusinessDays /></ProtectedRoute>} />
          {/* Public: closure notice */}
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
