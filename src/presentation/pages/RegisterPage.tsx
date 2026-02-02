import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layouts";
import { authService } from "../../infrastructure/services/AuthService";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "guest" as "guest" | "owner"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await authService.getRepository().register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password_confirm: formData.confirmPassword,
                full_name: formData.fullName,
                user_type: formData.userType
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Crear cuenta</h1>
                        <p className="text-gray-600">Únete a nuestra comunidad de viajeros</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-app-text mb-2">
                                Nombre completo
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                placeholder="Juan Pérez García"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-app-text mb-2">
                                Nombre de usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                placeholder="juanperez"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-app-text mb-2">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-app-text mb-2">
                                Tipo de cuenta
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: "guest" })}
                                    className={`h-12 px-4 border rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-secondary ${
                                        formData.userType === "guest"
                                            ? "bg-secondary text-white border-secondary"
                                            : "bg-white text-app-text border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    Huésped
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userType: "owner" })}
                                    className={`h-12 px-4 border rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-secondary ${
                                        formData.userType === "owner"
                                            ? "bg-secondary text-white border-secondary"
                                            : "bg-white text-app-text border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    Propietario
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-app-text mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-app-text mb-2">
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white font-medium rounded-xl hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-secondary font-medium hover:text-primary transition-colors">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
