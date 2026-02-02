import React, { memo } from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({
    size = 'md',
    message
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
            <div
                className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
                role="status"
                aria-label="Cargando"
            />
            {message && (
                <p className="text-gray-600 text-sm">{message}</p>
            )}
        </div>
    );
});
