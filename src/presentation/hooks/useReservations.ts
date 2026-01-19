import { useState } from "react";
import { reservationService } from "../../infrastructure/services/ReservationService";
import {
  Reservation,
  CreateReservationData,
  CancelReservationData,
  CheckAvailabilityParams,
  AvailabilityResponse,
  ReservationFilters,
  CalendarParams,
} from "../../domain/entities/Reservation";

export function useReservations() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

  const createReservation = async (data: CreateReservationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().createReservation(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear reservación');
      console.error('Error en crear reservación:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMyReservations = async (filters?: ReservationFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().getMyReservations(filters);
      setReservations(response.data || response.results || []);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al cargar reservaciones');
      console.error('Error al cargar reservaciones:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReservationById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const reservation = await reservationService.getRepository().getReservationById(id);
      setCurrentReservation(reservation);
      return reservation;
    } catch (err: any) {
      setError(err.message || 'Error al cargar reservación');
      console.error('Error al cargar reservación:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: string, data: CancelReservationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().cancelReservation(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al cancelar reservación');
      console.error('Error al cancelar reservación:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (params: CheckAvailabilityParams): Promise<AvailabilityResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().checkAvailability(params);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al verificar disponibilidad');
      console.error('Error al verificar disponibilidad:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPropertyReservations = async (filters?: ReservationFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().getPropertyReservations(filters);
      setReservations(response.data || response.results || []);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al cargar reservaciones de propiedades');
      console.error('Error al cargar reservaciones de propiedades:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmReservation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().confirmReservation(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al confirmar reservación');
      console.error('Error al confirmar reservación:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectReservation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().rejectReservation(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al rechazar reservación');
      console.error('Error al rechazar reservación:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeReservation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().completeReservation(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al completar reservación');
      console.error('Error al completar reservación:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCalendar = async (params: CalendarParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getRepository().getCalendar(params);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al cargar calendario');
      console.error('Error al cargar calendario:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    reservations,
    currentReservation,
    createReservation,
    getMyReservations,
    getReservationById,
    cancelReservation,
    checkAvailability,
    getPropertyReservations,
    confirmReservation,
    rejectReservation,
    completeReservation,
    getCalendar,
  };
}
