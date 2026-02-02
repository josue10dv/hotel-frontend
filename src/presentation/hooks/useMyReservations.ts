import { useState, useEffect } from 'react';
import { Reservation } from '../../domain/entities/Reservation';
import { reservationService } from '../../infrastructure/services/ReservationService';

export type FilterStatus = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

export function useMyReservations() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener reservaciones desde la API
            const data = await reservationService.getRepository().getMyReservations();
            setReservations(data.results || []);
        } catch (err: any) {
            setError(err.message || 'Error al cargar reservaciones');
            console.error('Error loading reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelReservation = async (id: string, reason: string): Promise<void> => {
        try {
            // Cancelar reservación en la API
            await reservationService.getRepository().cancelReservation(id, {
                cancellation_reason: reason
            });

            // Actualizar localmente
            setReservations(prev =>
                prev.map(r =>
                    r.id === id
                        ? { ...r, status: 'cancelled' as const, cancellation_reason: reason, updated_at: new Date().toISOString() }
                        : r
                )
            );
        } catch (err: any) {
            console.error('Error cancelling reservation:', err);
            throw err;
        }
    };

    // Filtrar reservaciones
    const filteredReservations = reservations
        .filter(r => {
            if (filterStatus === 'all') return true;
            return r.status === filterStatus;
        })
        .filter(r => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                (r.reservation_id?.toLowerCase().includes(query)) ||
                (r.room_id?.toLowerCase().includes(query))
            );
        })
        .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());

    const getStatsByStatus = () => {
        return {
            total: reservations.length,
            pending: reservations.filter(r => r.status === 'pending').length,
            confirmed: reservations.filter(r => r.status === 'confirmed').length,
            completed: reservations.filter(r => r.status === 'completed').length,
            cancelled: reservations.filter(r => r.status === 'cancelled').length,
        };
    };

    const canCancelReservation = (reservation: Reservation): boolean => {
        const checkInDate = new Date(reservation.check_in);
        const now = new Date();
        return (
            (reservation.status === 'confirmed' || reservation.status === 'pending') &&
            checkInDate > now
        );
    };

    return {
        loading,
        error,
        reservations: filteredReservations,
        allReservations: reservations,
        filterStatus,
        searchQuery,
        setFilterStatus,
        setSearchQuery,
        cancelReservation,
        getStatsByStatus,
        canCancelReservation,
        refreshReservations: loadReservations
    };
}
