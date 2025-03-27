import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Simple user type
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

// Generate random ID for demo purposes
const generateId = () => Math.random().toString(36).substring(2, 11);

// Local storage keys
const USER_STORAGE_KEY = 'finance-tracker-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // For demo purposes - in a real app, this would connect to a backend
  const login = (email: string, password: string) => {
    // This is a demo login that accepts any credentials
    // In a real app, this would validate against a backend
    const newUser: User = {
      id: generateId(),
      name: email.split('@')[0], // Extract name from email for demo
      email,
    };
    
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    toast.success('Logged in successfully');
  };

  const signup = (name: string, email: string, password: string) => {
    // In a real app, this would create an account on the backend
    const newUser: User = {
      id: generateId(),
      name,
      email,
    };
    
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    toast.success('Account created successfully');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


