'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('teamflow_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (error) {
          console.warn('Session check failed, clearing stored auth token');
          localStorage.removeItem('teamflow_token');
          localStorage.removeItem('teamflow_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    localStorage.setItem('teamflow_token', res.token);
    localStorage.setItem('teamflow_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    router.push('/projects');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register({ name, email, password });
    localStorage.setItem('teamflow_token', res.token);
    localStorage.setItem('teamflow_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    router.push('/projects');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      localStorage.removeItem('teamflow_token');
      localStorage.removeItem('teamflow_user');
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
