import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-app-background flex items-center justify-center px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Recuperar contraseña</h1>
                        <p className="text-gray-600">Te enviaremos instrucciones por correo</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-app-text mb-2">Página en construcción</h3>
                        <p className="text-gray-600 mb-6">
                            La funcionalidad de recuperación de contraseña estará disponible próximamente.
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="text-secondary font-medium hover:text-primary transition-colors"
                        >
                            ← Volver a inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
