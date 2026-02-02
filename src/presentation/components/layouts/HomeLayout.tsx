import { ReactNode } from 'react';
import Header from '../Header';

interface HomeLayoutProps {
    children: ReactNode;
}

/**
 * Layout especial para la página de inicio
 * Solo incluye Header (sin Footer para maximizar el espacio del mapa)
 * Estructura: Header + Body (full height)
 */
export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <div className="min-h-screen bg-app-background font-sans">
            <Header />
            {children}
        </div>
    );
}
