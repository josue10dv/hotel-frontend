import {
  Reservation,
  CreateReservationData,
  CancelReservationData,
  CheckAvailabilityParams,
  AvailabilityResponse,
  ReservationFilters,
  CalendarParams,
} from "../entities/Reservation";

export interface PaginatedResponse<T> {
  count: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
  data?: T[];
  results?: T[];
}

export interface ReservationRepository {
  createReservation(data: CreateReservationData): Promise<{ message: string; data: Reservation }>;
  getMyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>>;
  getReservationById(id: string): Promise<Reservation>;
  cancelReservation(id: string, data: CancelReservationData): Promise<{ message: string; data: Reservation }>;
  checkAvailability(params: CheckAvailabilityParams): Promise<AvailabilityResponse>;
  
  // Endpoints para propietarios
  getPropertyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>>;
  confirmReservation(id: string): Promise<{ message: string; data: Reservation }>;
  rejectReservation(id: string): Promise<{ message: string; data: Reservation }>;
  completeReservation(id: string): Promise<{ message: string; data: Reservation }>;
  getCalendar(params: CalendarParams): Promise<any>;
}
