'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { Role } from '@/src/lib/auth/permissions';

export function RoleGuard({ roles, children, fallback = null }: { roles: Role[], children: React.ReactNode, fallback?: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
