import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'business')[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect business users to their dashboard and customers to home
    return <Redirect href={user.role === 'business' ? "/(app)" : "/(app)/index"} />;
  }

  return <>{children}</>;
}