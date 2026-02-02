import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
    title: string;
    message?: string;
    showHomeLink?: boolean;
}

export const ErrorState = memo(function ErrorState({
    title,
    message,
    showHomeLink = true
}: ErrorStateProps) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            {message && <p className="text-red-600 mb-4">{message}</p>}
            {showHomeLink && (
                <Link
                    to="/"
                    className="text-primary hover:underline mt-4 inline-block transition-colors"
                >
                    Volver al Inicio
                </Link>
            )}
        </div>
    );
});
