'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isAuthenticated, isPasswordSetup, login, logout, setupPassword, changePassword } from '@/lib/auth';

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  isSetup: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setupPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const [authenticated, setup] = await Promise.all([
        isAuthenticated(),
        isPasswordSetup(),
      ]);
      setIsLoggedIn(authenticated);
      setIsSetup(setup);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (password: string) => {
    const result = await login(password);
    if (result.success) {
      setIsLoggedIn(true);
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  const handleSetupPassword = async (password: string) => {
    const result = await setupPassword(password);
    if (result.success) {
      setIsSetup(true);
      setIsLoggedIn(true);
    }
    return result;
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    return changePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        isSetup,
        login: handleLogin,
        logout: handleLogout,
        setupPassword: handleSetupPassword,
        changePassword: handleChangePassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
