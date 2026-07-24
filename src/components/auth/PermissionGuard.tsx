'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { Permission, hasPermission } from '@/src/lib/auth/permissions';

export function PermissionGuard({ permission, children, fallback = null }: { permission: Permission, children: React.ReactNode, fallback?: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
