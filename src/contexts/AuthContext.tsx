import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const tokenSalvo = await AsyncStorage.getItem('@proestoque:token');
        const userSalvo = await AsyncStorage.getItem('@proestoque:user');
        if (tokenSalvo && userSalvo) {
          setToken(tokenSalvo);
          setUser(JSON.parse(userSalvo));
        }
      } catch (e) {
        console.log('Erro ao carregar sessão', e);
      } finally {
        setIsLoading(false);
      }
    }
    carregarSessao();
  }, []);

  async function login(email: string, senha: string) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const novoUser: User = {
      id: '1',
      nome: email.split('@')[0],
      email,
    };
    const novoToken = 'mock-token-123';
    await AsyncStorage.setItem('@proestoque:token', novoToken);
    await AsyncStorage.setItem('@proestoque:user', JSON.stringify(novoUser));
    setUser(novoUser);
    setToken(novoToken);
    setIsLoading(false);
  }

  async function logout() {
    await AsyncStorage.removeItem('@proestoque:token');
    await AsyncStorage.removeItem('@proestoque:user');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}