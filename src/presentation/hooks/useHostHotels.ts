import { useState, useEffect, useCallback } from 'react';
import { Hotel, Address, Policies } from '../../domain/entities/Hotel';
import { CreateHotelDTO } from '../../domain/usecases/CreateHotel';
import { hotelService } from '../../infrastructure/services/HotelService';

export interface HotelFormData {
    name: string;
    description: string;
    property_type: 'hotel' | 'apartment' | 'house' | 'room' | 'resort' | 'hostel';
    address: Address;
    coordinates?: { lat: number; lng: number };
    amenities: string[];
    services?: string[];
    images: string[]; // URLs para preview
    imageFiles: File[]; // Archivos reales para subir
    policies: Policies;
    min_price?: number; // Precio mínimo por noche
    contact?: {
        phone: string;
        email: string;
        website?: string;
    };
}

export const initialFormData: HotelFormData = {
    name: '',
    description: '',
    property_type: 'hotel',
    address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
    },
    amenities: [],
    services: [],
    images: [],
    imageFiles: [],
    policies: {
        check_in_time: '15:00',
        check_out_time: '12:00',
        cancellation_policy: 'Cancelación gratuita hasta 24 horas antes',
        pet_policy: 'No se aceptan mascotas'
    },
    min_price: undefined,
    contact: {
        phone: '',
        email: '',
        website: ''
    }
};

export function useHostHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const fetchHotels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Obtener solo los hoteles del usuario anfitrión
            const data = await hotelService.getRepository().getMyHotels();
            setHotels(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los hoteles');
            console.error('Error cargando hoteles:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    const createHotel = useCallback(async (formData: HotelFormData): Promise<Hotel> => {
        setIsCreating(true);
        setError(null);

        try {
            // Usar el repositorio directamente con FormData
            const newHotel = await hotelService.getRepository().createHotel(formData);
            setHotels(prev => [...prev, newHotel]);
            return newHotel;
        } catch (err: any) {
            const errorMessage = err.message || 'Error al crear el hotel';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    }, []);

    const deleteHotel = useCallback(async (hotelId: string): Promise<void> => {
        setError(null);

        try {
            await hotelService.getRepository().deleteHotel(hotelId);
            setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
        } catch (err: any) {
            const errorMessage = err.message || 'Error al eliminar el hotel';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    const updateHotel = useCallback(async (hotelId: string, formData: Partial<HotelFormData>): Promise<Hotel> => {
        setError(null);

        try {
            const updatedHotel = await hotelService.getRepository().updateHotel(hotelId, formData);
            setHotels(prev => prev.map(hotel => 
                hotel.id === hotelId ? updatedHotel : hotel
            ));
            return updatedHotel;
        } catch (err: any) {
            const errorMessage = err.message || 'Error al actualizar el hotel';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    return {
        hotels,
        loading,
        error,
        isCreating,
        createHotel,
        updateHotel,
        deleteHotel,
        refetchHotels: fetchHotels
    };
}
