import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import DataEntry from "./pages/DataEntry";
import OwnerPortal from "./pages/OwnerPortal";
import MaintenanceHub from "./pages/MaintenanceHub";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Main Application Hub
 * Orchestrates industrial routing and secure session state
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Entrance */}
          <Route path="/" element={<HomeGate />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* owner-dashboard: Dynamic Strategy Center */}
          <Route path="/owner-dashboard" element={
            <ProtectedRoute allowedRoles={['owner']}>
              <ErrorBoundary>
                <Dashboard defaultTab="strategy" />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* manager-dashboard: Operations Analytics */}
          <Route path="/manager-dashboard" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ErrorBoundary>
                <Dashboard defaultTab="overview" />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* operator-dashboard: Field Telemetry */}
          <Route path="/operator-dashboard" element={
            <ProtectedRoute allowedRoles={['operator']}>
              <ErrorBoundary>
                <Dashboard defaultTab="overview" />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Shared Tools (Specific Role Access) */}
          <Route path="/scheduler" element={
            <ProtectedRoute allowedRoles={['owner', 'manager']}>
              <Dashboard defaultTab="scheduler" />
            </ProtectedRoute>
          } />

          <Route path="/fyp-optimizer" element={
            <ProtectedRoute allowedRoles={['owner', 'manager']}>
              <Dashboard defaultTab="fyp" />
            </ProtectedRoute>
          } />

          <Route path="/entry" element={
            <ProtectedRoute allowedRoles={['operator', 'manager']}>
              <DataEntry />
            </ProtectedRoute>
          } />

          <Route path="/owner" element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerPortal />
            </ProtectedRoute>
          } />

          <Route path="/maintenance-hub" element={
            <ProtectedRoute allowedRoles={['operator', 'manager', 'owner']}>
              <MaintenanceHub />
            </ProtectedRoute>
          } />

          {/* Redirects & Fallbacks */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

/**
 * Intelligent Entry Gate
 * Analyzes session to determine appropriate landing vector
 */
function HomeGate() {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return null; // Or a splash screen

  if (isAuthenticated && user) {
    const vectorMap = {
      owner: '/owner-dashboard',
      manager: '/manager-dashboard',
      operator: '/operator-dashboard'
    };
    return <Navigate to={vectorMap[user.role] || '/owner-dashboard'} replace />;
  }

  return <Landing />;
}

export default App;