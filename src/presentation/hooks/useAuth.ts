import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../infrastructure/services/AuthService";
import { AuthCredentials, RegisterData, User, ChangePasswordData } from "../../domain/entities/User";

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const loginWithEmail = async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getRepository().loginWithEmail(credentials);
      setUser(response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getRepository().loginWithGoogle();
      setUser(response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      console.error('Error en login con Google:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.getRepository().register(data);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      console.error('Error en registro:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.getRepository().logout();
      setUser(null);
      navigate('/login');
    } catch (err: any) {
      console.error('Error en logout:', err);
    }
  };

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await authService.getRepository().getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err: any) {
      setError(err.message || 'Error al obtener usuario');
      console.error('Error al obtener usuario:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getRepository().updateUser(id, data);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario');
      console.error('Error al actualizar usuario:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (id: string, data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getRepository().changePassword(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
      console.error('Error al cambiar contraseña:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    user,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    getCurrentUser,
    updateUser,
    changePassword,
    };
}
