import { useState, useEffect } from 'react';
import { Reservation } from '../../domain/entities/Reservation';
import { reservationService } from '../../infrastructure/services/ReservationService';

export interface DashboardStats {
    totalReservations: number;
    activeReservations: number;
    completedReservations: number;
    cancelledReservations: number;
    totalSpent: number;
    upcomingReservations: number;
}

export function useDashboard() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalReservations: 0,
        activeReservations: 0,
        completedReservations: 0,
        cancelledReservations: 0,
        totalSpent: 0,
        upcomingReservations: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        if (reservations.length > 0) {
            calculateStats();
        }
    }, [reservations]);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener reservaciones desde la API
            const data = await reservationService.getRepository().getMyReservations();
            setReservations(data.results || []);
        } catch (err: any) {
            setError(err.message || 'Error al cargar datos del dashboard');
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const now = new Date();

        const activeCount = reservations.filter(r =>
            r.status === 'confirmed' || r.status === 'pending'
        ).length;

        const completedCount = reservations.filter(r =>
            r.status === 'completed'
        ).length;

        const cancelledCount = reservations.filter(r =>
            r.status === 'cancelled'
        ).length;

        const upcomingCount = reservations.filter(r => {
            const checkIn = new Date(r.check_in);
            return checkIn > now && (r.status === 'confirmed' || r.status === 'pending');
        }).length;

        const totalAmount = reservations
            .filter(r => r.status !== 'cancelled')
            .reduce((sum, r) => sum + r.total_price, 0);

        setStats({
            totalReservations: reservations.length,
            activeReservations: activeCount,
            completedReservations: completedCount,
            cancelledReservations: cancelledCount,
            totalSpent: totalAmount,
            upcomingReservations: upcomingCount,
        });
    };

    const getUpcomingReservations = (limit: number = 3): Reservation[] => {
        const now = new Date();
        return reservations
            .filter(r => {
                const checkIn = new Date(r.check_in);
                return checkIn > now && (r.status === 'confirmed' || r.status === 'pending');
            })
            .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
            .slice(0, limit);
    };

    return {
        loading,
        error,
        reservations,
        stats,
        getUpcomingReservations,
        refreshData: loadDashboardData
    };
}
