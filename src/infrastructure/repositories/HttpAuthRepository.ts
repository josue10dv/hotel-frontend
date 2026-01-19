import { AuthCredentials, AuthResponse, RefreshResponse, RegisterData, User, ChangePasswordData } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpAuthRepository implements AuthRepository {
  async loginWithEmail(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        credentials
      );
      
      if (response.access) {
        localStorage.setItem('auth_token', response.access);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      console.error('Error en login con email:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        '/auth/google/',
        {}
      );
      
      if (response.access) {
        localStorage.setItem('auth_token', response.access);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    }
  }

  async register(data: RegisterData): Promise<{ message: string; user: Partial<User> }> {
    try {
      const response = await httpClient.post<{ message: string; user: Partial<User> }>(
        API_ENDPOINTS.auth.register,
        data
      );
      return response;
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  async refreshToken(): Promise<RefreshResponse> {
    try {
      const response = await httpClient.post<RefreshResponse>(
        API_ENDPOINTS.auth.refresh,
        {}
      );
      
      if (response.access) {
        localStorage.setItem('auth_token', response.access);
      }
      
      return response;
    } catch (error: any) {
      console.error('Error al refrescar token:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      throw new Error(error.message || 'Sesión expirada');
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.auth.logout, {});
    } catch (error: any) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get<User>(API_ENDPOINTS.auth.me);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error: any) {
      console.error('Error al obtener usuario actual:', error);
      throw new Error(error.message || 'Error al obtener usuario');
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<{ message: string; user: User }> {
    try {
      const response = await httpClient.patch<{ message: string; user: User }>(
        API_ENDPOINTS.auth.updateUser(id),
        data
      );
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }

  async changePassword(id: string, data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>(
        API_ENDPOINTS.auth.changePassword(id),
        data
      );
      return response;
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      throw new Error(error.message || 'Error al cambiar contraseña');
        }
    }
}
