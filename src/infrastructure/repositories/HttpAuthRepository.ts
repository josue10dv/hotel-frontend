import { AuthCredentials, AuthResponse, RefreshResponse, RegisterData, User, ChangePasswordData } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpAuthRepository implements AuthRepository {
  async loginWithEmail(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<{ status: string; data: AuthResponse }>(
        API_ENDPOINTS.auth.login,
        {
          username: credentials.email || credentials.username,
          password: credentials.password
        }
      );
      
      // Extraer data de la respuesta anidada
      const authData = response.data || response;
      
      // Guardar access token (el refresh token se guarda automáticamente en cookie HTTP-only)
      if (authData.access) {
        localStorage.setItem('access_token', authData.access);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
      
      return authData;
    } catch (error: any) {
      console.error('Error en login con email:', error);
      throw new Error(error.message || 'Credenciales inválidas');
    }
  }

  async register(data: RegisterData): Promise<{ message: string; user: Partial<User> }> {
    try {
      const response = await httpClient.post<{ message: string; data: Partial<User> }>(
        API_ENDPOINTS.users.register,
        data
      );
      
      return {
        message: response.message,
        user: response.data
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Manejar errores de validación del backend
      if (error.data && typeof error.data === 'object') {
        const messages = Object.entries(error.data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('\n');
        throw new Error(messages);
      }
      
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  async refreshToken(): Promise<RefreshResponse> {
    try {
      const response = await httpClient.post<{ access: string }>(
        API_ENDPOINTS.auth.refresh,
        {} // No body needed, el backend lee la cookie con el refresh token
      );
      
      if (response.access) {
        localStorage.setItem('access_token', response.access);
      }
      
      return { access: response.access };
    } catch (error: any) {
      console.error('Error al refrescar token:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      throw new Error(error.message || 'Sesión expirada');
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.auth.logout, {});
    } catch (error: any) {
      console.error('Error en logout:', error);
      // Continuar con la limpieza local incluso si falla la petición al servidor
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get<User>(API_ENDPOINTS.users.me);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error: any) {
      console.error('Error al obtener usuario actual:', error);
      throw new Error(error.message || 'Error al obtener usuario');
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<{ message: string; user: User }> {
    try {
      const response = await httpClient.patch<{ message: string; data: User }>(
        API_ENDPOINTS.users.update(id),
        data
      );
      
      // Actualizar usuario en localStorage si es el usuario actual
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id === id) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return {
        message: response.message,
        user: response.data
      };
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }

  async changePassword(id: string, data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>(
        API_ENDPOINTS.users.changePassword(id),
        data
      );
      return response;
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      
      // Manejar errores de validación del backend
      if (error.data && typeof error.data === 'object') {
        const messages = Object.values(error.data).flat().join('\n');
        throw new Error(messages);
      }
      
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  }
}
