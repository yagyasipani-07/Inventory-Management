'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { featuresConfig } from '@/src/config';
import { Role } from '@/src/lib/auth/permissions';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder logic for auth.
    // When real auth is implemented, this will fetch the user session.
    if (featuresConfig.enableAuthentication) {
      // Simulate auth check
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      // In V1, bypass auth completely by providing a mock admin user
      setUser({
        id: 'demo-user',
        name: 'Demo Admin',
        email: 'demo@parasplywoods.com',
        role: 'ADMIN',
      });
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
