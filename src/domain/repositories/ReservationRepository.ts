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
    createReservation(data: CreateReservationData): Promise<Reservation>;
    getMyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>>;
    getReservationById(id: string): Promise<Reservation>;
    cancelReservation(id: string, data?: CancelReservationData): Promise<Reservation>;
    checkAvailability(params: CheckAvailabilityParams): Promise<AvailabilityResponse>;
    // Endpoints para propietarios
    getPropertyReservations(filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>>;
    confirmReservation(id: string): Promise<Reservation>;
    rejectReservation(id: string, reason?: string): Promise<Reservation>;
    completeReservation(id: string): Promise<Reservation>;
    getCalendar(params: CalendarParams): Promise<any>;
}
