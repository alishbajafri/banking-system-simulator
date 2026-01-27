import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types/api';
import { setAuthToken } from '@/services/api';

interface AuthContextType {
  user: User | null;
  accountId: number | null; // keep accountId
  balance: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, accountId: number, balance: number) => void; // add accountId param
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // ✅ login now requires accountId
  const login = (userData: User, token: string, accId: number, initialBalance: number) => {
    setUser(userData);
    setAccountId(accId); // ✅ use passed accountId
    setBalance(initialBalance); // ✅ use passed balance
    setAuthToken(token);
  };


  const logout = () => {
    setUser(null);
    setAccountId(null);
    setBalance(0);
    setAuthToken(null);
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accountId,
        balance,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
