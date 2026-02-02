import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: ReactNode;
}

/**
 * Layout para páginas de autenticación (Login, Register, Forgot Password)
 * Estructura: Logo + Body centrado
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-app-background flex flex-col">
            {/* Header minimalista solo con logo */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <span className="text-primary text-xl font-bold tracking-tight">
                        Nomada
                    </span>
                </Link>
            </div>

            {/* Main Content - centrado vertical y horizontalmente */}
            <div className="flex-1 flex items-center justify-center px-8">
                {children}
            </div>

            {/* Footer minimalista */}
            <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Nomada. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
