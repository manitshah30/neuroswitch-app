import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

// This is the "guard" for pages only logged-out users should see.
export default function LoggedOutRoute() {
  const { currentUser } = useAuth();

  // If a user IS LOGGED IN, redirect them away from the sign-in page to the dashboard.
  // If not, show the sign-in page.
  return !currentUser ? <Outlet /> : <Navigate to="/dashboard" />;
}

