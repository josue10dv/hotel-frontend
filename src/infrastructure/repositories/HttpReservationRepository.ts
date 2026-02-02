import {
    Reservation,
    CreateReservationData,
    CancelReservationData,
    CheckAvailabilityParams,
    AvailabilityResponse,
    ReservationFilters,
    CalendarParams,
} from "../../domain/entities/Reservation";
import { ReservationRepository, PaginatedResponse } from "../../domain/repositories/ReservationRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpReservationRepository implements ReservationRepository {
    async createReservation(data: CreateReservationData): Promise<Reservation> {
        try {
            return await httpClient.post<Reservation>(
                API_ENDPOINTS.reservations.create,
                data
            );
        } catch (error: any) {
            console.error('Error al crear reservación:', error);
            throw new Error(error.message || 'No se pudo crear la reservación');
        }
    }

    async getMyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> {
        try {
            const queryParams: Record<string, string> = {};

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams[key] = String(value);
                    }
                });
            }

            const response = await httpClient.get<{ count: number; reservations: Reservation[] }>(
                API_ENDPOINTS.reservations.myReservations,
                { params: queryParams }
            );

            return {
                count: response.count,
                results: response.reservations,
            };
        } catch (error: any) {
            console.error('Error al obtener mis reservaciones:', error);
            throw new Error(error.message || 'No se pudieron cargar tus reservaciones');
        }
    }

    async getReservationById(id: string): Promise<Reservation> {
        try {
            const reservation = await httpClient.get<Reservation>(
                API_ENDPOINTS.reservations.getById(id)
            );
            return reservation;
        } catch (error: any) {
            console.error(`Error al obtener reservación ${id}:`, error);
            throw new Error(error.message || 'No se pudo cargar la reservación');
        }
    }

    async cancelReservation(id: string, data?: CancelReservationData): Promise<Reservation> {
        try {
            return await httpClient.patch<Reservation>(
                API_ENDPOINTS.reservations.cancel(id),
                data || {}
            );
        } catch (error: any) {
            console.error('Error al cancelar reservación:', error);
            throw new Error(error.message || 'No se pudo cancelar la reservación');
        }
    }

    async checkAvailability(params: CheckAvailabilityParams): Promise<AvailabilityResponse> {
        try {
            const queryParams: Record<string, any> = {
                hotel_id: params.hotel_id,
                room_id: params.room_id,
                check_in: params.check_in,
                check_out: params.check_out,
            };

            return await httpClient.get<AvailabilityResponse>(
                API_ENDPOINTS.reservations.checkAvailability,
                { params: queryParams }
            );
        } catch (error: any) {
            console.error('Error al verificar disponibilidad:', error);
            throw new Error(error.message || 'No se pudo verificar la disponibilidad');
        }
    }

    // Endpoints para propietarios
    async getPropertyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> {
        try {
            const queryParams: Record<string, string> = {};

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams[key] = String(value);
                    }
                });
            }

            const response = await httpClient.get<{ count: number; reservations: Reservation[] }>(
                API_ENDPOINTS.reservations.myProperties,
                { params: queryParams }
            );

            return {
                count: response.count,
                results: response.reservations,
            };
        } catch (error: any) {
            console.error('Error al obtener reservaciones de propiedades:', error);
            throw new Error(error.message || 'No se pudieron cargar las reservaciones');
        }
    }

    async confirmReservation(id: string): Promise<Reservation> {
        try {
            return await httpClient.patch<Reservation>(
                API_ENDPOINTS.reservations.confirm(id),
                {}
            );
        } catch (error: any) {
            console.error('Error al confirmar reservación:', error);
            throw new Error(error.message || 'No se pudo confirmar la reservación');
        }
    }

    async rejectReservation(id: string, reason?: string): Promise<Reservation> {
        try {
            return await httpClient.patch<Reservation>(
                API_ENDPOINTS.reservations.reject(id),
                reason ? { rejection_reason: reason } : {}
            );
        } catch (error: any) {
            console.error('Error al rechazar reservación:', error);
            throw new Error(error.message || 'No se pudo rechazar la reservación');
        }
    }

    async completeReservation(id: string): Promise<Reservation> {
        try {
            return await httpClient.patch<Reservation>(
                API_ENDPOINTS.reservations.complete(id),
                {}
            );
        } catch (error: any) {
            console.error('Error al completar reservación:', error);
            throw new Error(error.message || 'No se pudo completar la reservación');
        }
    }

    async getCalendar(params: CalendarParams): Promise<any> {
        try {
            const queryParams: Record<string, string> = {
                hotel_id: params.hotel_id,
                month: String(params.month),
                year: String(params.year),
            };

            return await httpClient.get<any>(
                API_ENDPOINTS.reservations.calendar,
                { params: queryParams }
            );
        } catch (error: any) {
            console.error('Error al obtener calendario:', error);
            throw new Error(error.message || 'No se pudo cargar el calendario');
        }
    }
}
