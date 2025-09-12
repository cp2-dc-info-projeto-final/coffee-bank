import api from './api';

export interface User {
  id: string; // bigint from database comes as string in JSON
  name: string;
  cpf: string;
  //role: string; 
}

export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Funções para obter, criar ou limpar o token de autenticação
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('auth_token');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('auth_token', token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth_token');
  }
}

// Função de login, obtendo token do backend
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await api.post('/users/login', credentials);
    
    if (response.data.success && response.data.token) {
      setToken(response.data.token);
      return { success: true, token: response.data.token };
    }
    
    return { success: false, message: 'Credenciais inválidas' };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, message: 'Credenciais inválidas' };
  }
}

export async function logout(): Promise<void> {
  try {
    const token = getToken();
    if (token) {
      await api.post('/users/logout');
    }
  } catch (error) {
    console.error('Erro no logout:', error);
  } finally {
    removeToken();
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }

    const response = await api.get('/users/me');

    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    removeToken();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
