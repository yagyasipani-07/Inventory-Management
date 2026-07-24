'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { features } from '@/src/config';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (!features.enableAuth) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // When auth is implemented, redirect to login page.
    // window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
}
