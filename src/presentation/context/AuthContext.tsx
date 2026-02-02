import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../domain/entities/User';
import { authService } from '../../infrastructure/services/AuthService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    const currentUser = await authService.getRepository().getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Si hay error, limpiar el token inválido
                localStorage.removeItem('access_token');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.getRepository().loginWithEmail({
                username: email, // El backend espera 'username' pero aceptará email
                password,
                email
            });
            setUser(response.user);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.getRepository().logout();
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setUser(null);
            window.location.href = '/';
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await authService.getRepository().updateUser(user.id, data);
            setUser(response.user);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
