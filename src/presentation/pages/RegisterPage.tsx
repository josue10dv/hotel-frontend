import React from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-app-background flex items-center justify-center px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Crear cuenta</h1>
                        <p className="text-gray-600">Únete a nuestra comunidad</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <h3 className="text-lg font-medium text-app-text mb-2">Página en construcción</h3>
                        <p className="text-gray-600 mb-6">
                            El formulario de registro estará disponible próximamente.
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-secondary font-medium hover:text-primary transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
