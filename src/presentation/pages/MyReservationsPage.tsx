import { useState } from 'react';
import { DashboardLayout } from '../components/layouts';
import { useMyReservations, FilterStatus } from '../hooks/useMyReservations';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Reservation } from '../../domain/entities/Reservation';

export default function MyReservationsPage() {
    const {
        loading,
        error,
        reservations,
        filterStatus,
        searchQuery,
        setFilterStatus,
        setSearchQuery,
        cancelReservation,
        getStatsByStatus,
        canCancelReservation
    } = useMyReservations();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelClick = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowDetailsModal(false);
        setShowCancelModal(true);
    };

    const handleDetailsClick = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowDetailsModal(true);
    };

    const handleCancelConfirm = async () => {
        if (!selectedReservation || !cancellationReason.trim()) return;

        try {
            setIsCancelling(true);
            await cancelReservation(selectedReservation.id, cancellationReason);
            setShowCancelModal(false);
            setSelectedReservation(null);
            setCancellationReason('');
        } catch (err) {
            console.error('Error cancelling reservation:', err);
        } finally {
            setIsCancelling(false);
        }
    };

    const stats = getStatsByStatus();

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pendiente' },
            confirmed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Confirmada' },
            cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelada' },
            completed: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Completada' },
            rejected: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Rechazada' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-medium`}>
                {badge.label}
            </span>
        );
    };

    if (loading && reservations.length === 0) {
        return (
            <DashboardLayout>
                <LoadingSpinner message="Cargando tus reservaciones..." />
            </DashboardLayout>
        );
    }

    if (error && reservations.length === 0) {
        return (
            <DashboardLayout>
                <ErrorState title="Error al cargar reservaciones" message={error} />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Mis Reservaciones</h1>
                    <p className="text-gray-600 text-lg">
                        Gestiona y revisa todas tus reservaciones de hotel
                    </p>
                </div>

                {/* Filters and Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Bar */}
                        <div className="w-full lg:w-96">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por hotel, habitación..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                />
                                <svg
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'all', label: 'Todas', icon: '📋' },
                                { value: 'pending', label: 'Pendientes', icon: '⏳' },
                                { value: 'confirmed', label: 'Confirmadas', icon: '✅' },
                                { value: 'completed', label: 'Completadas', icon: '🎉' },
                                { value: 'cancelled', label: 'Canceladas', icon: '❌' },
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterStatus(filter.value as FilterStatus)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === filter.value
                                        ? 'bg-secondary text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="mr-2">{filter.icon}</span>
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', count: stats.total, color: 'blue' },
                        { label: 'Pendientes', count: stats.pending, color: 'yellow' },
                        { label: 'Confirmadas', count: stats.confirmed, color: 'green' },
                        { label: 'Completadas', count: stats.completed, color: 'purple' },
                    ].map((stat) => (
                        <div key={stat.label} className={`bg-${stat.color}-50 rounded-xl p-4 border border-${stat.color}-100`}>
                            <p className={`text-${stat.color}-600 text-sm font-medium mb-1`}>{stat.label}</p>
                            <p className="text-3xl font-bold text-primary">{stat.count}</p>
                        </div>
                    ))}
                </div>

                {/* Reservations List */}
                {reservations.length > 0 ? (
                    <div className="space-y-4">
                        {reservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Left Section - Hotel Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-primary mb-2">
                                                    {reservation.hotel_name || `Hotel ${reservation.hotel_id}`}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        Habitación {reservation.room_number || reservation.room_id}
                                                    </span>
                                                    {reservation.room_type && (
                                                        <span className="px-2 py-1 bg-gray-100 rounded-lg">
                                                            {reservation.room_type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {getStatusBadge(reservation.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {/* Check-in */}
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 mb-1">Check-in</p>
                                                    <p className="font-semibold text-primary">
                                                        {new Date(reservation.check_in).toLocaleDateString('es-ES', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Check-out */}
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 mb-1">Check-out</p>
                                                    <p className="font-semibold text-primary">
                                                        {new Date(reservation.check_out).toLocaleDateString('es-ES', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {(reservation.total_nights || reservation.nights)} noches
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {reservation.number_of_guests} huéspedes
                                            </span>
                                        </div>

                                        {reservation.special_requests && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                                                <p className="text-xs text-blue-600 font-medium mb-1">Solicitudes especiales:</p>
                                                <p className="text-sm text-gray-700">{reservation.special_requests}</p>
                                            </div>
                                        )}

                                        {reservation.cancellation_reason && (
                                            <div className="mt-4 p-3 bg-red-50 rounded-xl">
                                                <p className="text-xs text-red-600 font-medium mb-1">Razón de cancelación:</p>
                                                <p className="text-sm text-gray-700">{reservation.cancellation_reason}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Section - Price and Actions */}
                                    <div className="lg:w-64 flex flex-col gap-4">
                                        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 text-white">
                                            <p className="text-sm opacity-90 mb-2">Precio Total</p>
                                            <p className="text-4xl font-bold mb-3">${reservation.total_price.toLocaleString()}</p>
                                            <div className="text-xs opacity-75">
                                                <p>${(reservation.price_per_night || (reservation.total_price / reservation.nights)).toLocaleString()} por noche</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {canCancelReservation(reservation) && (
                                                <button
                                                    onClick={() => handleCancelClick(reservation)}
                                                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancelar Reservación
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDetailsClick(reservation)}
                                                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Ver Detalles
                                            </button>
                                        </div>

                                        <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                                            <p>ID: {reservation.id.slice(0, 8)}</p>
                                            <p className="mt-1">
                                                Creado: {new Date(reservation.created_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchQuery || filterStatus !== 'all'
                                ? 'No se encontraron reservaciones'
                                : 'No tienes reservaciones aún'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || filterStatus !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : '¡Comienza a explorar hoteles increíbles para tu próxima aventura!'}
                        </p>
                        {!searchQuery && filterStatus === 'all' && (
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl hover:bg-secondary/90 transition-colors font-medium text-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Explorar Hoteles
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedReservation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-primary">Detalles de Reservación</h3>
                                    <p className="text-sm text-gray-600">ID: {selectedReservation.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedReservation(null);
                                }}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* Estado */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Estado de la Reservación</span>
                                {getStatusBadge(selectedReservation.status)}
                            </div>

                            {/* Hotel Information */}
                            <div>
                                <h4 className="text-lg font-bold text-primary mb-3">Información del Hotel</h4>
                                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-semibold text-lg">{selectedReservation.hotel_name || `Hotel ${selectedReservation.hotel_id}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span>Habitación {selectedReservation.room_number || selectedReservation.room_id}</span>
                                        {selectedReservation.room_type && (
                                            <span className="ml-2 px-2 py-1 bg-white rounded-lg text-sm text-gray-900">
                                                {selectedReservation.room_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Fechas de Estancia */}
                            <div>
                                <h4 className="text-lg font-bold text-primary mb-3">Fechas de Estancia</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-green-700 font-medium">Check-in</p>
                                                <p className="text-lg font-bold text-green-900">
                                                    {new Date(selectedReservation.check_in).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-red-700 font-medium">Check-out</p>
                                                <p className="text-lg font-bold text-red-900">
                                                    {new Date(selectedReservation.check_out).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {(selectedReservation.total_nights || selectedReservation.nights)} {(selectedReservation.total_nights || selectedReservation.nights) === 1 ? 'noche' : 'noches'}
                                    </span>
                                </div>
                            </div>

                            {/* Información de Huéspedes */}
                            <div>
                                <h4 className="text-lg font-bold text-primary mb-3">Información de Huéspedes</h4>
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-purple-700">Nombre del Huésped</span>
                                        <span className="font-semibold text-purple-900">{selectedReservation.guest_details?.name || selectedReservation.guest_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-purple-700">Email</span>
                                        <span className="font-semibold text-purple-900">{selectedReservation.guest_details?.email || selectedReservation.guest_email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-purple-700">Teléfono</span>
                                        <span className="font-semibold text-purple-900">{selectedReservation.guest_details?.phone || selectedReservation.guest_phone || 'N/A'}</span>
                                    </div>
                                    <div className="pt-3 border-t border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-purple-700">Adultos</span>
                                            <span className="font-semibold text-purple-900">{selectedReservation.number_of_guests}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-purple-700">Niños</span>
                                            <span className="font-semibold text-purple-900">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles de Precio */}
                            <div>
                                <h4 className="text-lg font-bold text-primary mb-3">Detalles de Precio</h4>
                                <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-5 text-white space-y-3">
                                    <div className="flex items-center justify-between pb-3 border-b border-white/20">
                                        <span className="text-sm opacity-90">Precio por noche</span>
                                        <span className="text-xl font-bold">${(selectedReservation.price_per_night || (selectedReservation.total_price / selectedReservation.nights)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-3 border-b border-white/20">
                                        <span className="text-sm opacity-90">Número de noches</span>
                                        <span className="text-xl font-bold">{selectedReservation.total_nights || selectedReservation.nights}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-lg font-semibold">Precio Total</span>
                                        <span className="text-3xl font-bold">${selectedReservation.total_price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Solicitudes Especiales */}
                            {selectedReservation.special_requests && (
                                <div>
                                    <h4 className="text-lg font-bold text-primary mb-3">Solicitudes Especiales</h4>
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <p className="text-gray-700">{selectedReservation.special_requests}</p>
                                    </div>
                                </div>
                            )}

                            {/* Razón de Cancelación */}
                            {selectedReservation.cancellation_reason && (
                                <div>
                                    <h4 className="text-lg font-bold text-primary mb-3">Razón de Cancelación</h4>
                                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                        <p className="text-gray-700">{selectedReservation.cancellation_reason}</p>
                                    </div>
                                </div>
                            )}

                            {/* Fechas de Sistema */}
                            <div>
                                <h4 className="text-lg font-bold text-primary mb-3">Información del Sistema</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Fecha de Creación</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(selectedReservation.created_at).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Última Actualización</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(selectedReservation.updated_at!).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    {selectedReservation.confirmed_at && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg md:col-span-2">
                                            <span className="text-gray-600">Fecha de Confirmación</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(selectedReservation.confirmed_at).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedReservation(null);
                                }}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cerrar
                            </button>
                            {canCancelReservation(selectedReservation) && (
                                <button
                                    onClick={() => handleCancelClick(selectedReservation)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar Reservación
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && selectedReservation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-primary">Cancelar Reservación</h3>
                                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-medium text-gray-900 mb-1">{selectedReservation.hotel_name || `Hotel ${selectedReservation.hotel_id}`}</p>
                            <p className="text-xs text-gray-600">
                                {new Date(selectedReservation.check_in).toLocaleDateString('es-ES')} - {new Date(selectedReservation.check_out).toLocaleDateString('es-ES')}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Razón de cancelación *
                            </label>
                            <textarea
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="Por favor, cuéntanos por qué cancelas esta reservación..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedReservation(null);
                                    setCancellationReason('');
                                }}
                                disabled={isCancelling}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                disabled={!cancellationReason.trim() || isCancelling}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
