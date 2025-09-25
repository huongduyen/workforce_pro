export interface User {
  id: string;
  email: string;
  password?: string;
  role: string;
  isActive: boolean;
}

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}
