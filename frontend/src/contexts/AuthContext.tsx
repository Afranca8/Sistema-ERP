import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/api.ts';

interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (login: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@StopCar:user');
    const storedToken = localStorage.getItem('@StopCar:token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  async function signIn(login: string, senha: string) {
    try {
      const response = await api.post('/login', { email: login, password: senha });
      const { user, token } = response.data;
      
      localStorage.setItem('@StopCar:token', token);
      localStorage.setItem('@StopCar:user', JSON.stringify(user));
      
      setUser(user);
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login.';
      
      if (error.response?.data?.errors?.email) {
        errorMessage = error.response.data.errors.email[0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o Laravel está rodando.';
      }
      
      throw new Error(errorMessage);
    }
  }

  async function signOut() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erro ao fazer logout', error);
    } finally {
      localStorage.removeItem('@StopCar:token');
      localStorage.removeItem('@StopCar:user');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}