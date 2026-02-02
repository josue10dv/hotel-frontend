import { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * Layout principal para las secciones de hoteles y reservaciones
 * Estructura: Header + Body + Footer
 */
export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            {/* Main Content - con padding-top para compensar el header fixed */}
            <main className="flex-1 pt-16">
                {children}
            </main>

            <Footer />
        </div>
    );
}
