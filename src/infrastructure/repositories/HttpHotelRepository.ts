import { Hotel } from "../../domain/entities/Hotel";
import { HotelRepository } from "../../domain/repositories/HotelRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpHotelRepository implements HotelRepository {
    async getHotels(): Promise<Hotel[]> {
        try {
            const hotels = await httpClient.get<Hotel[]>(API_ENDPOINTS.hotels.getAll);
            return hotels;
        } catch (error: any) {
            console.error('Error al obtener hoteles:', error);
            throw new Error(error.message || 'No se pudieron cargar los hoteles');
        }
    }

    async getHotelById(id: string): Promise<Hotel | undefined> {
        try {
            const hotel = await httpClient.get<Hotel>(API_ENDPOINTS.hotels.getById(id));
            return hotel;
        } catch (error: any) {
            if (error.status === 404) {
                return undefined;
            }
            console.error(`Error al obtener hotel ${id}:`, error);
            throw new Error(error.message || 'No se pudo cargar el hotel');
        }
    }

    async searchHotels(query: string): Promise<Hotel[]> {
        try {
            const hotels = await httpClient.get<Hotel[]>(API_ENDPOINTS.hotels.search, {
                q: query,
            });
            return hotels;
        } catch (error: any) {
            console.error('Error al buscar hoteles:', error);
            throw new Error(error.message || 'Error en la búsqueda');
        }
    }

    async filterByCategory(category: string): Promise<Hotel[]> {
        try {
            const hotels = await httpClient.get<Hotel[]>(API_ENDPOINTS.hotels.filterByCategory, {
                category,
            });
            return hotels;
        } catch (error: any) {
            console.error('Error al filtrar por categoría:', error);
            throw new Error(error.message || 'Error al filtrar');
        }
    }
}
