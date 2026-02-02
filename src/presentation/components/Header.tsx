import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { NotificationBell } from './common/NotificationBell';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuthContext();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const getInitials = (fullName?: string) => {
        if (!fullName) return 'U';
        const names = fullName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
        }
        return names[0].charAt(0).toUpperCase();
    };

    const getFullName = () => {
        if (!user) return 'Usuario';
        return user.full_name || user.username;
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-primary border-b border-white/10 z-50">
            <div className="h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-primary"
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
                    <span className="text-white text-xl font-bold tracking-tight">
                        Nomada
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <>
                            <NotificationBell />
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-xl transition-all group"
                                >
                                    <div className="text-right hidden md:block">
                                        <p className="text-white text-sm font-semibold leading-tight">
                                            {getFullName()}
                                        </p>
                                        <p className="text-white/70 text-xs capitalize">
                                            {user.user_type === 'owner' ? 'Anfitrión' : 'Huésped'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-secondary border-2 border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                                        <span className="text-primary font-bold text-sm">
                                            {getInitials(user.full_name)}
                                        </span>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-white/70 transition-transform ${showMenu ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Menú Desplegable */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 overflow-hidden">
                                        <Link
                                            to="/"
                                            onClick={() => setShowMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <span className="font-medium">Inicio</span>
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setShowMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <span className="font-medium">Dashboard</span>
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            onClick={() => setShowMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span className="font-medium">Wishlist</span>
                                        </Link>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-medium">Cerrar Sesión</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-secondary text-primary px-6 py-2 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
