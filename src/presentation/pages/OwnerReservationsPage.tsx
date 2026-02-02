import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layouts';
import { reservationService } from '../../infrastructure/services/ReservationService';
import { Reservation } from '../../domain/entities/Reservation';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Calendar, Check, X, CheckCircle, Filter } from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';

export default function OwnerReservationsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [selectedHotel, setSelectedHotel] = useState<string>('all');
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [actionType, setActionType] = useState<'confirm' | 'reject' | 'complete' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, [filterStatus, selectedHotel]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters: any = {};
            if (filterStatus !== 'all') {
                filters.status = filterStatus;
            }
            if (selectedHotel !== 'all') {
                filters.hotel_id = selectedHotel;
            }

            const response = await reservationService.getRepository().getPropertyReservations(filters);
            setReservations(response.results || []);
        } catch (err: any) {
            setError(err.message || 'Error al cargar reservaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setActionType('confirm');
        setShowActionModal(true);
    };

    const handleReject = async (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setActionType('reject');
        setShowActionModal(true);
    };

    const handleComplete = async (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setActionType('complete');
        setShowActionModal(true);
    };

    const executeAction = async () => {
        if (!selectedReservation || !actionType) return;

        try {
            setIsProcessing(true);

            switch (actionType) {
                case 'confirm':
                    await reservationService.getRepository().confirmReservation(selectedReservation.id);
                    break;
                case 'reject':
                    await reservationService.getRepository().rejectReservation(selectedReservation.id);
                    break;
                case 'complete':
                    await reservationService.getRepository().completeReservation(selectedReservation.id);
                    break;
            }

            // Actualizar la lista
            await fetchReservations();
            setShowActionModal(false);
            setSelectedReservation(null);
            setActionType(null);
        } catch (err: any) {
            setError(err.message || 'Error al procesar la acción');
        } finally {
            setIsProcessing(false);
        }
    };

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

    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'pending').length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        completed: reservations.filter(r => r.status === 'completed').length,
    };

    if (loading && reservations.length === 0) {
        return (
            <DashboardLayout>
                <LoadingSpinner message="Cargando reservaciones..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Reservaciones</h1>
                    <p className="text-gray-600 text-lg">
                        Administra las reservaciones de tus propiedades
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Total</h3>
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary">{stats.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Pendientes</h3>
                            <Filter className="w-5 h-5 text-yellow-600" />
                        </div>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Confirmadas</h3>
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Completadas</h3>
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">Todas</option>
                                <option value="pending">Pendientes</option>
                                <option value="confirmed">Confirmadas</option>
                                <option value="cancelled">Canceladas</option>
                                <option value="rejected">Rechazadas</option>
                                <option value="completed">Completadas</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Reservations List */}
                <div className="space-y-4">
                    {reservations.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No hay reservaciones
                            </h3>
                            <p className="text-gray-600">
                                {filterStatus === 'all' 
                                    ? 'Aún no tienes reservaciones en tus propiedades'
                                    : `No hay reservaciones con estado: ${filterStatus}`
                                }
                            </p>
                        </div>
                    ) : (
                        reservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-primary mb-1">
                                                    {reservation.reservation_id}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Hotel ID: {reservation.hotel_id}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Habitación: {reservation.room_id}
                                                </p>
                                            </div>
                                            {getStatusBadge(reservation.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Check-in</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(reservation.check_in).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Check-out</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(reservation.check_out).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Huéspedes</p>
                                                <p className="font-semibold text-gray-900">
                                                    {reservation.number_of_guests}
                                                </p>
                                            </div>
                                        </div>

                                        {reservation.guest_details && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm font-semibold text-gray-900 mb-2">Información del Huésped</p>
                                                <div className="space-y-1 text-sm">
                                                    <p><span className="text-gray-600">Nombre:</span> <span className="font-medium">{reservation.guest_details.name}</span></p>
                                                    <p><span className="text-gray-600">Email:</span> <span className="font-medium">{reservation.guest_details.email}</span></p>
                                                    <p><span className="text-gray-600">Teléfono:</span> <span className="font-medium">{reservation.guest_details.phone}</span></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                        <div className="text-right mb-2">
                                            <p className="text-sm text-gray-600">Total</p>
                                            <p className="text-2xl font-bold text-primary">
                                                ${reservation.total_price}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {reservation.nights} noches × ${reservation.price_per_night}
                                            </p>
                                        </div>

                                        {reservation.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleConfirm(reservation)}
                                                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Confirmar
                                                </button>
                                                <button
                                                    onClick={() => handleReject(reservation)}
                                                    className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Rechazar
                                                </button>
                                            </>
                                        )}

                                        {reservation.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleComplete(reservation)}
                                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Completar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Action Confirmation Modal */}
                {showActionModal && selectedReservation && actionType && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {actionType === 'confirm' && 'Confirmar Reservación'}
                                {actionType === 'reject' && 'Rechazar Reservación'}
                                {actionType === 'complete' && 'Completar Reservación'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {actionType === 'confirm' && '¿Estás seguro de confirmar esta reservación?'}
                                {actionType === 'reject' && '¿Estás seguro de rechazar esta reservación?'}
                                {actionType === 'complete' && '¿Estás seguro de marcar esta reservación como completada?'}
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-600 mb-1">Reservación: <span className="font-semibold text-gray-900">{selectedReservation.reservation_id}</span></p>
                                <p className="text-sm text-gray-600">Huésped: <span className="font-semibold text-gray-900">{selectedReservation.guest_details?.name || 'N/A'}</span></p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowActionModal(false);
                                        setSelectedReservation(null);
                                        setActionType(null);
                                    }}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={executeAction}
                                    disabled={isProcessing}
                                    className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                                        actionType === 'confirm' ? 'bg-green-600 hover:bg-green-700' :
                                        actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                                        'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {isProcessing ? 'Procesando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
