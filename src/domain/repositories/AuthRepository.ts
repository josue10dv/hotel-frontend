import { AuthCredentials, AuthResponse, RefreshResponse, RegisterData, User, ChangePasswordData } from "../entities/User";

export interface AuthRepository {
  loginWithEmail(credentials: AuthCredentials): Promise<AuthResponse>;
  loginWithGoogle(): Promise<AuthResponse>;
  register(data: RegisterData): Promise<{ message: string; user: Partial<User> }>;
  refreshToken(): Promise<RefreshResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<{ message: string; user: User }>;
  changePassword(id: string, data: ChangePasswordData): Promise<{ message: string }>;
}
