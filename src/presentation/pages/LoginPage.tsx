import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { AuthLayout } from "../components/layouts";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuthContext();
    const navigate = useNavigate();

    // Verificar si el usuario fue redirigido desde una página protegida
    const hasRedirect = localStorage.getItem('redirectAfterLogin');
    const isFromListing = hasRedirect?.includes('/listing/');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(username, password);
            // Verificar si hay una URL guardada para redirigir desde listing
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath && redirectPath.includes('/listing/')) {
                // Si viene desde listing, redirigir a esa página específica
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            } else {
                // Limpiar cualquier otro redirect y siempre ir al dashboard
                localStorage.removeItem('redirectAfterLogin');
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };



    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Iniciar sesión</h1>
                        <p className="text-gray-600">Bienvenido de vuelta</p>
                    </div>

                    {/* Alerta de sesión requerida */}
                    {hasRedirect && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-blue-800 text-sm font-medium">Sesión requerida</p>
                                    <p className="text-blue-700 text-xs mt-1">
                                        {isFromListing 
                                            ? 'Debes iniciar sesión para ver los detalles y reservar este hotel' 
                                            : 'Debes iniciar sesión para continuar'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-app-text mb-2">
                                Nombre de usuario o correo
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="usuario o email@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-app-text mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-secondary hover:text-primary transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white font-medium rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link
                                to="/register"
                                className="text-secondary font-medium hover:text-primary transition-colors"
                            >
                                Crear cuenta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
