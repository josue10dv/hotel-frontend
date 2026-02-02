import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/layouts";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // El endpoint aún no está disponible en el backend
            // await authService.getRepository().requestPasswordReset(email);
            console.log("Solicitar recuperación para:", email);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Error al enviar solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Recuperar contraseña</h1>
                        <p className="text-gray-600">Te enviaremos instrucciones por correo</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-app-text mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-12 bg-primary text-white font-medium rounded-xl hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Enviar instrucciones
                            </button>
                        </form>
                    ) : (
                        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 text-center">
                            <svg className="w-12 h-12 text-secondary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <h3 className="text-lg font-semibold text-primary mb-2">¡Correo enviado!</h3>
                            <p className="text-gray-600 text-sm">
                                Revisa tu bandeja de entrada. Te hemos enviado las instrucciones para recuperar tu contraseña.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-secondary font-medium hover:text-primary transition-colors inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
