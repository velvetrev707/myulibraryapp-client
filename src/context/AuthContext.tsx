import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'student' | 'librarian';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.user_id,
          username: decoded.username,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          email: decoded.email,
          user_type: decoded.user_type
        });
      } catch (e) {
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string) => {
    const response = await api.post('/token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    const decoded: any = jwtDecode(response.data.access);
    setUser({
      id: decoded.user_id,
      username: decoded.username,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      user_type: decoded.user_type
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
