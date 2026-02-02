import React, { memo } from 'react';

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const CARD_BASE_STYLES = 'bg-white p-6 rounded-2xl border border-gray-200';
const TITLE_STYLES = 'text-xl font-bold text-primary mb-4';

/**
 * Componente reutilizable de tarjeta de información
 * Proporciona un contenedor estándar con título y contenido
 */
export const InfoCard = memo(function InfoCard({ 
    title, 
    children, 
    className = '' 
}: InfoCardProps) {
    return (
        <div className={`${CARD_BASE_STYLES} ${className}`}>
            <h3 className={TITLE_STYLES}>{title}</h3>
            {children}
        </div>
    );
});
