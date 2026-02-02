import { DashboardLayout } from '../components/layouts';
import { useAuthContext } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    const { user } = useAuthContext();
    const { loading, stats, getUpcomingReservations } = useDashboard();

    const upcomingReservations = getUpcomingReservations(3);

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingSpinner message="Cargando tu dashboard..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        ¡Bienvenido de vuelta{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Aquí está un resumen de tu actividad reciente
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Reservaciones */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-primary mb-1">{stats.totalReservations}</h3>
                        <p className="text-gray-600 text-sm">Total Reservaciones</p>
                    </div>

                    {/* Reservaciones Activas */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                                Activas
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-primary mb-1">{stats.activeReservations}</h3>
                        <p className="text-gray-600 text-sm">Reservaciones Activas</p>
                    </div>

                    {/* Próximas */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-primary mb-1">{stats.upcomingReservations}</h3>
                        <p className="text-gray-600 text-sm">Próximas Reservaciones</p>
                    </div>

                    {/* Total Gastado */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-primary mb-1">
                            ${stats.totalSpent.toLocaleString()}
                        </h3>
                        <p className="text-gray-600 text-sm">Total Invertido</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Próximas Reservaciones */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-primary">Próximas Reservaciones</h2>
                                <Link
                                    to="/reservations"
                                    className="text-secondary hover:text-secondary/80 text-sm font-medium transition-colors"
                                >
                                    Ver todas →
                                </Link>
                            </div>

                            {upcomingReservations.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingReservations.map((reservation) => (
                                        <div
                                            key={reservation.id}
                                            className="border border-gray-200 rounded-xl p-5 hover:border-secondary/50 hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-primary mb-1">
                                                        {reservation.hotel_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Habitación {reservation.room_number} • {reservation.room_type}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${reservation.status === 'confirmed'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-yellow-50 text-yellow-700'
                                                    }`}>
                                                    {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-600">
                                                        {new Date(reservation.check_in).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span className="text-gray-600">
                                                        {reservation.number_of_guests} huéspedes
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div>
                                                    <span className="text-sm text-gray-600">{reservation.nights} noches</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-primary">
                                                        ${reservation.total_price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes próximas reservaciones</h3>
                                    <p className="text-gray-600 mb-4">¿Listo para tu próxima aventura?</p>
                                    <Link
                                        to="/"
                                        className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors font-medium"
                                    >
                                        Explorar Hoteles
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen de Actividad */}
                    <div className="space-y-6">
                        {/* Actividad Reciente */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-primary mb-6">Resumen</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Completadas</p>
                                            <p className="text-xs text-gray-500">Total de estadías</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-primary">{stats.completedReservations}</span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Canceladas</p>
                                            <p className="text-xs text-gray-500">Historial</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-primary">{stats.cancelledReservations}</span>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Promedio</p>
                                            <p className="text-xs text-gray-500">Por reservación</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-primary">
                                        ${stats.totalReservations > 0
                                            ? Math.round(stats.totalSpent / stats.totalReservations).toLocaleString()
                                            : 0
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl shadow-sm p-6 text-white">
                            <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span className="font-medium">Buscar Hoteles</span>
                                </Link>
                                <Link
                                    to="/reservations"
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="font-medium">Mis Reservaciones</span>
                                </Link>
                                <Link
                                    to="/host"
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="font-medium">Gestionar Hoteles</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
