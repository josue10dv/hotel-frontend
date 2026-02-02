import { useState, useEffect } from 'react';
import { Hotel } from '../../domain/entities/Hotel';
import { hotelService } from '../../infrastructure/services/HotelService';

export const useHotelDetails = (hotelId: string | undefined) => {
    const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        if (hotelId) {
            const fetchHotel = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await hotelService.getHotelByIdUseCase.execute(hotelId);
                    setHotel(data);
                } catch (err: any) {
                    setError(err.message || 'Error al cargar el hotel');
                    console.error('Error cargando hotel:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchHotel();
        }
    }, [hotelId]);

    const toggleShowAllReviews = () => {
        setShowAllReviews(prev => !prev);
    };

    return {
        hotel,
        loading,
        error,
        showAllReviews,
        toggleShowAllReviews
    };
};
