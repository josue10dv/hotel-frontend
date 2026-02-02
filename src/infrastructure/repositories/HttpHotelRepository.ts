import { Hotel, Room } from "../../domain/entities/Hotel";
import { HotelRepository } from "../../domain/repositories/HotelRepository";
import { CreateHotelDTO } from "../../domain/usecases/CreateHotel";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS, API_CONFIG } from "../../config/api.config";

export interface HotelListResponse {
    count: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    results: Hotel[];
}

export interface HotelSearchParams {
    q?: string; // Término de búsqueda
    page?: number;
    page_size?: number;
    city?: string;
    country?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    amenities?: string;
    guests?: number;
}

export interface AddRoomDTO {
    name: string;
    description: string;
    type: 'single' | 'double' | 'twin' | 'suite' | 'deluxe' | 'family' | 'studio';
    capacity: number;
    price_per_night: number;
    available?: boolean;
    amenities?: string[];
    images?: string[];
}

export class HttpHotelRepository implements HotelRepository {
    async getHotels(): Promise<Hotel[]> {
        try {
            const response = await httpClient.get<HotelListResponse>(
                API_ENDPOINTS.hotels.list
            );
            return response.results || [];
        } catch (error: any) {
            console.error('Error al obtener hoteles:', error);
            throw new Error(error.message || 'No se pudieron cargar los hoteles');
        }
    }

    async getHotelById(id: string): Promise<Hotel | undefined> {
        try {
            const hotel = await httpClient.get<Hotel>(
                API_ENDPOINTS.hotels.getById(id)
            );
            return hotel;
        } catch (error: any) {
            if (error.status === 404) {
                return undefined;
            }
            console.error(`Error al obtener hotel ${id}:`, error);
            throw new Error(error.message || 'No se pudo cargar el hotel');
        }
    }

    async createHotel(data: any): Promise<Hotel> {
        try {
            const formData = new FormData();

            // Campos básicos
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('property_type', data.property_type);

            // Address como JSON string
            formData.append('address', JSON.stringify({
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                country: data.address.country,
                postal_code: data.address.postal_code,
                coordinates: data.coordinates
            }));

            // Amenities y services como JSON arrays
            formData.append('amenities', JSON.stringify(data.amenities || []));
            if (data.services && data.services.length > 0) {
                formData.append('services', JSON.stringify(data.services));
            }

            // Policies como JSON string
            formData.append('policies', JSON.stringify(data.policies));

            // Contact como JSON string (si existe)
            if (data.contact) {
                formData.append('contact', JSON.stringify(data.contact));
            }

            // Agregar archivos de imagen
            if (data.imageFiles && data.imageFiles.length > 0) {
                data.imageFiles.forEach((file: File) => {
                    formData.append('image_files', file);
                });
            }

            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.hotels.create}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'No se pudo crear el hotel');
            }

            const result = await response.json();
            return result.data;
        } catch (error: any) {
            console.error('Error al crear hotel:', error);
            throw new Error(error.message || 'No se pudo crear el hotel');
        }
    }

    async updateHotel(id: string, data: any): Promise<Hotel> {
        try {
            // Si hay archivos de imagen nuevos, usar FormData
            if (data.imageFiles && data.imageFiles.length > 0) {
                const formData = new FormData();

                // Solo agregar campos que han cambiado
                if (data.name) formData.append('name', data.name);
                if (data.description) formData.append('description', data.description);
                if (data.property_type) formData.append('property_type', data.property_type);

                if (data.address) {
                    formData.append('address', JSON.stringify({
                        street: data.address.street,
                        city: data.address.city,
                        state: data.address.state,
                        country: data.address.country,
                        postal_code: data.address.postal_code,
                        coordinates: data.coordinates || data.address.coordinates
                    }));
                }

                if (data.amenities) formData.append('amenities', JSON.stringify(data.amenities));
                if (data.services) formData.append('services', JSON.stringify(data.services));
                if (data.policies) formData.append('policies', JSON.stringify(data.policies));
                if (data.contact) formData.append('contact', JSON.stringify(data.contact));

                // Agregar nuevos archivos de imagen
                data.imageFiles.forEach((file: File) => {
                    formData.append('image_files', file);
                });

                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.hotels.update(id)}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'No se pudo actualizar el hotel');
                }

                const result = await response.json();
                return result.data;
            } else {
                // Si no hay archivos, usar JSON con PATCH
                const response = await httpClient.patch<{ message: string; data: Hotel }>(
                    API_ENDPOINTS.hotels.update(id),
                    data
                );
                return response.data;
            }
        } catch (error: any) {
            console.error('Error al actualizar hotel:', error);
            throw new Error(error.message || 'No se pudo actualizar el hotel');
        }
    }

    async deleteHotel(id: string, permanent: boolean = false): Promise<void> {
        try {
            const endpoint = permanent
                ? `${API_ENDPOINTS.hotels.delete(id)}?permanent=true`
                : API_ENDPOINTS.hotels.delete(id);

            await httpClient.delete(endpoint);
        } catch (error: any) {
            console.error('Error al eliminar hotel:', error);
            throw new Error(error.message || 'No se pudo eliminar el hotel');
        }
    }

    async getMyHotels(): Promise<Hotel[]> {
        try {
            const response = await httpClient.get<HotelListResponse>(
                API_ENDPOINTS.hotels.myHotels
            );
            return response.results || [];
        } catch (error: any) {
            console.error('Error al obtener mis hoteles:', error);
            throw new Error(error.message || 'No se pudieron cargar tus hoteles');
        }
    }

    async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
        try {
            const queryParams: Record<string, string> = {};

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams[key] = String(value);
                }
            });

            const response = await httpClient.get<HotelListResponse>(
                API_ENDPOINTS.hotels.search,
                queryParams
            );

            return response.results || [];
        } catch (error: any) {
            console.error('Error al buscar hoteles:', error);
            throw new Error(error.message || 'Error en la búsqueda');
        }
    }

    async addRoom(hotelId: string, roomData: AddRoomDTO): Promise<Room> {
        try {
            const response = await httpClient.post<{ message: string; data: Hotel }>(
                API_ENDPOINTS.hotels.addRoom(hotelId),
                roomData
            );
            // La API devuelve el hotel completo, extraer la última habitación agregada
            const hotel = response.data;
            if (hotel.rooms && hotel.rooms.length > 0) {
                return hotel.rooms[hotel.rooms.length - 1];
            }
            throw new Error('No se pudo obtener la habitación creada');
        } catch (error: any) {
            console.error('Error al agregar habitación:', error);
            throw new Error(error.message || 'No se pudo agregar la habitación');
        }
    }

    async updateRoom(hotelId: string, roomId: string, roomData: Partial<AddRoomDTO>): Promise<Room> {
        try {
            const response = await httpClient.patch<{ message: string; data: Hotel }>(
                API_ENDPOINTS.hotels.updateRoom(hotelId, roomId),
                roomData
            );
            // La API devuelve el hotel completo, buscar la habitación actualizada
            const hotel = response.data;
            const updatedRoom = hotel.rooms?.find(room => room.room_id === roomId);
            if (updatedRoom) {
                return updatedRoom;
            }
            throw new Error('No se pudo obtener la habitación actualizada');
        } catch (error: any) {
            console.error('Error al actualizar habitación:', error);
            throw new Error(error.message || 'No se pudo actualizar la habitación');
        }
    }

    async deleteRoom(hotelId: string, roomId: string): Promise<void> {
        try {
            await httpClient.delete(
                API_ENDPOINTS.hotels.deleteRoom(hotelId, roomId)
            );
        } catch (error: any) {
            console.error('Error al eliminar habitación:', error);
            throw new Error(error.message || 'No se pudo eliminar la habitación');
        }
    }
}
