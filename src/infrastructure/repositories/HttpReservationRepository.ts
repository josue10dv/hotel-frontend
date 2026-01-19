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
    async createReservation(data: CreateReservationData): Promise<{ message: string; data: Reservation }> {
        try {
            const response = await httpClient.post<{ message: string; data: Reservation }>(
                API_ENDPOINTS.reservations.create,
                data
            );
            return response;
        } catch (error: any) {
            console.error('Error al crear reservación:', error);
            throw new Error(error.message || 'Error al crear la reservación');
        }
    }

    async getMyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> {
        try {
            const response = await httpClient.get<PaginatedResponse<Reservation>>(
                API_ENDPOINTS.reservations.getAll,
                filters
            );
            return response;
        } catch (error: any) {
            console.error('Error al obtener reservaciones:', error);
            throw new Error(error.message || 'Error al cargar las reservaciones');
        }
    }

    async getReservationById(id: string): Promise<Reservation> {
        try {
            const response = await httpClient.get<Reservation>(
                API_ENDPOINTS.reservations.getById(id)
            );
            return response;
        } catch (error: any) {
            console.error(`Error al obtener reservación ${id}:`, error);
            throw new Error(error.message || 'Error al cargar la reservación');
        }
    }

    async cancelReservation(id: string, data: CancelReservationData): Promise<{ message: string; data: Reservation }> {
        try {
            const response = await httpClient.patch<{ message: string; data: Reservation }>(
                API_ENDPOINTS.reservations.cancel(id),
                data
            );
            return response;
        } catch (error: any) {
            console.error(`Error al cancelar reservación ${id}:`, error);
            throw new Error(error.message || 'Error al cancelar la reservación');
        }
    }

    async checkAvailability(params: CheckAvailabilityParams): Promise<AvailabilityResponse> {
        try {
            const response = await httpClient.get<AvailabilityResponse>(
                API_ENDPOINTS.reservations.checkAvailability,
                params as any
            );
            return response;
        } catch (error: any) {
            console.error('Error al verificar disponibilidad:', error);
            throw new Error(error.message || 'Error al verificar disponibilidad');
        }
    }

    async getPropertyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> {
        try {
            const response = await httpClient.get<PaginatedResponse<Reservation>>(
                API_ENDPOINTS.reservations.myProperties,
                filters
            );
            return response;
        } catch (error: any) {
            console.error('Error al obtener reservaciones de propiedades:', error);
            throw new Error(error.message || 'Error al cargar reservaciones de propiedades');
        }
    }

    async confirmReservation(id: string): Promise<{ message: string; data: Reservation }> {
        try {
            const response = await httpClient.patch<{ message: string; data: Reservation }>(
                API_ENDPOINTS.reservations.confirm(id),
                {}
            );
            return response;
        } catch (error: any) {
            console.error(`Error al confirmar reservación ${id}:`, error);
            throw new Error(error.message || 'Error al confirmar la reservación');
        }
    }

    async rejectReservation(id: string): Promise<{ message: string; data: Reservation }> {
        try {
            const response = await httpClient.patch<{ message: string; data: Reservation }>(
                API_ENDPOINTS.reservations.reject(id),
                {}
            );
            return response;
        } catch (error: any) {
            console.error(`Error al rechazar reservación ${id}:`, error);
            throw new Error(error.message || 'Error al rechazar la reservación');
        }
    }

    async completeReservation(id: string): Promise<{ message: string; data: Reservation }> {
        try {
            const response = await httpClient.patch<{ message: string; data: Reservation }>(
                API_ENDPOINTS.reservations.complete(id),
                {}
            );
            return response;
        } catch (error: any) {
            console.error(`Error al completar reservación ${id}:`, error);
            throw new Error(error.message || 'Error al completar la reservación');
        }
    }

    async getCalendar(params: CalendarParams): Promise<any> {
        try {
            const response = await httpClient.get<any>(
                API_ENDPOINTS.reservations.calendar,
                params as any
            );
            return response;
        } catch (error: any) {
            console.error('Error al obtener calendario:', error);
            throw new Error(error.message || 'Error al cargar el calendario');
        }
    }
}
