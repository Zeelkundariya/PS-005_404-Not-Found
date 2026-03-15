import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Access Guard Component
 * Enforces authentication and role-based permissions
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  // 1. Session Initialization State
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020617',
        color: '#22d3ee',
        fontFamily: 'monospace'
      }}>
        <div style={{ animation: 'pulse 1.5s infinite' }}>SYNCING SECURE NODE...</div>
      </div>
    );
  }

  // 2. Unauthenticated Access Block
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Permission Filtering (Role-Based)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Determine rescue destination based on actual role
    const rescueMap = {
      owner: '/owner-dashboard',
      manager: '/manager-dashboard',
      operator: '/operator-dashboard'
    };
    
    return <Navigate to={rescueMap[user.role] || '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
