import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Main Pages
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import PolicymakerDashboard from "./pages/PolicymakerDashboard";
import ScientistDashboard from "./pages/ScientistDashboard";

// Feature Pages
// DataUpload, HMPICalculations, Map, and Reports are now integrated into AdminDashboard
// import DataUpload from "./pages/DataUpload";
// import HMPICalculations from "./pages/HMPICalculations";
// import Map from "./pages/Map";
// import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />

          {/* Public Routes */}
          <Route path="/homepage" element={<Homepage />} />

          {/* Protected Main Dashboard Routes */}
          {/* Note: Users are redirected to role-specific dashboards after login */}

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/dashboard/:tab"
            element={<AdminDashboard />}
          />

          {/* Scientist Routes */}
          <Route
            path="/scientist/dashboard"
            element={<ScientistDashboard />}
          />
          <Route
            path="/scientist/dashboard/:tab"
            element={<ScientistDashboard />}
          />

          {/* Policymaker Routes */}
          <Route
            path="/policymaker/dashboard"
            element={<PolicymakerDashboard />}
          />
          <Route
            path="/policymaker/dashboard/:tab"
            element={<PolicymakerDashboard />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
