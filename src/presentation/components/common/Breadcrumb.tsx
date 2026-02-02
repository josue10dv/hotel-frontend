import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/**
 * Componente de navegación breadcrumb
 * Muestra la ruta de navegación actual con separadores visuales
 */
export const Breadcrumb = memo(function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="mb-6 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <span className="text-gray-400" aria-hidden="true">›</span>
                    )}
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="text-secondary hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-app-text font-medium">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
});
