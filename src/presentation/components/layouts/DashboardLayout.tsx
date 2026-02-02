import { ReactNode } from 'react';
import Header from '../Header';
import SideNavbar from '../SideNavbar';
import Footer from '../Footer';

interface DashboardLayoutProps {
    children: ReactNode;
}

/**
 * Layout con sidebar para secciones administrativas o de usuario
 * Estructura: Header + Sidebar + Body + Footer
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            {/* Container principal con sidebar y content */}
            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
                    <SideNavbar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
}
