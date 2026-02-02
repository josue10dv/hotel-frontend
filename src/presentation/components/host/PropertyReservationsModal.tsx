import { useState, useEffect } from 'react';
import { X, Calendar, Users, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Reservation } from '../../../domain/entities/Reservation';
import { reservationService } from '../../../infrastructure/services/ReservationService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface PropertyReservationsModalProps {
    isOpen: boolean;
    hotelId: string;
    hotelName: string;
    onClose: () => void;
}

export function PropertyReservationsModal({ isOpen, hotelId, hotelName, onClose }: PropertyReservationsModalProps) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchReservations();
        }
    }, [isOpen, hotelId]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await reservationService.getRepository().getPropertyReservations({
                hotel_id: hotelId
            });
            setReservations(response.results || []);
        } catch (err: any) {
            setError(err.message || 'Error al cargar reservaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (reservationId: string) => {
        try {
            setActionLoading(reservationId);
            await reservationService.getRepository().confirmReservation(reservationId);
            await fetchReservations(); // Recargar lista
        } catch (err: any) {
            alert(err.message || 'Error al confirmar reservación');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (reservationId: string) => {
        const reason = prompt('Motivo del rechazo (opcional):');
        try {
            setActionLoading(reservationId);
            await reservationService.getRepository().rejectReservation(reservationId, reason || undefined);
            await fetchReservations();
        } catch (err: any) {
            alert(err.message || 'Error al rechazar reservación');
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (reservationId: string) => {
        if (!confirm('¿Marcar esta reservación como completada?')) return;
        try {
            setActionLoading(reservationId);
            await reservationService.getRepository().completeReservation(reservationId);
            await fetchReservations();
        } catch (err: any) {
            alert(err.message || 'Error al completar reservación');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
            rejected: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rechazada' },
            completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completada' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
                {badge.label}
            </span>
        );
    };

    const filteredReservations = filterStatus === 'all'
        ? reservations
        : reservations.filter(r => r.status === filterStatus);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Reservaciones</h2>
                        <p className="text-white/90 text-sm mt-1">{hotelName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filterStatus === status
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'all' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : filteredReservations.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hay reservaciones en esta categoría</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-gray-900">
                                                    {reservation.reservation_id}
                                                </h3>
                                                {getStatusBadge(reservation.status)}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Habitación: {reservation.room_id}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary">
                                                ${reservation.total_price}
                                            </div>
                                            <p className="text-xs text-gray-500">{reservation.currency || 'USD'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Check-in</p>
                                                <p>{new Date(reservation.check_in).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Check-out</p>
                                                <p>{new Date(reservation.check_out).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Huéspedes</p>
                                                <p>{reservation.number_of_guests}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {reservation.guest_details && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Datos del huésped:</p>
                                            <p className="text-sm text-gray-600">{reservation.guest_details.name}</p>
                                            <p className="text-sm text-gray-600">{reservation.guest_details.email}</p>
                                            <p className="text-sm text-gray-600">{reservation.guest_details.phone}</p>
                                            {reservation.guest_details.special_requests && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <span className="font-medium">Solicitudes:</span> {reservation.guest_details.special_requests}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {reservation.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleConfirm(reservation.id)}
                                                    disabled={actionLoading === reservation.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Confirmar
                                                </button>
                                                <button
                                                    onClick={() => handleReject(reservation.id)}
                                                    disabled={actionLoading === reservation.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                        {reservation.status === 'confirmed' && new Date(reservation.check_out) < new Date() && (
                                            <button
                                                onClick={() => handleComplete(reservation.id)}
                                                disabled={actionLoading === reservation.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                                            >
                                                <Clock className="w-4 h-4" />
                                                Marcar Completada
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
