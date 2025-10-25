import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

// This is the "guard" for pages only logged-in users should see.
export default function LoggedInRoute() {
  // Get the current user from our "brain" (the AuthContext)
  const { currentUser } = useAuth();

  // If a user is logged in, show the page they were trying to access.
  // If not, redirect them to the sign-in page.
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}

