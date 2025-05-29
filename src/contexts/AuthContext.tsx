
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple in-memory storage for demo - in production, this would be a proper backend
const USERS_KEY = 'echoverse_users';
const CURRENT_USER_KEY = 'echoverse_current_user';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app start
    const initializeAuth = () => {
      try {
        const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserId) {
          const users = getStoredUsers();
          const storedUser = users.find(u => u.id === currentUserId);
          if (storedUser) {
            setUser({
              id: storedUser.id,
              email: storedUser.email,
              name: storedUser.name,
              createdAt: storedUser.createdAt
            });
          } else {
            // Clean up invalid session
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const getStoredUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = getStoredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (user) {
        const authUser: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        };
        setUser(authUser);
        localStorage.setItem(CURRENT_USER_KEY, user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const users = getStoredUsers();
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return false;
      }

      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        name: name.trim(),
        password, // In production, this would be hashed
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveStoredUsers(users);

      const authUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt
      };
      setUser(authUser);
      localStorage.setItem(CURRENT_USER_KEY, newUser.id);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    // Don't remove user entries storage key, as it's user-specific
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
