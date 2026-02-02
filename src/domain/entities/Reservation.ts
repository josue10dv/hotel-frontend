// Entidades para el módulo de Reservaciones

export interface GuestDetails {
    name: string;
    email: string;
    phone: string;
    special_requests?: string;
}

export interface Reservation {
    id: string;
    reservation_id: string;
    hotel_id: string;
    hotel_name?: string; // Opcional: nombre del hotel para mostrar
    room_id: string;
    room_number?: string; // Opcional: número de habitación para mostrar
    room_type?: string; // Opcional: tipo de habitación
    guest_id: string;
    guest_name?: string; // Opcional: nombre del huésped
    guest_email?: string; // Opcional: email del huésped
    guest_phone?: string; // Opcional: teléfono del huésped
    owner_id: string;
    check_in: string;
    check_out: string;
    nights: number;
    total_nights?: number; // Alias para nights
    number_of_guests: number;
    guest_details?: GuestDetails;
    price_per_night?: number; // Opcional: calculado como total_price / nights si no viene del API
    total_price: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';
    payment_status: 'pending' | 'paid' | 'refunded';
    special_requests?: string;
    cancellation_reason?: string;
    created_at: string;
    updated_at?: string;
    cancelled_at?: string;
    confirmed_at?: string;
}

export interface CreateReservationData {
    hotel_id: string;
    room_id: string;
    check_in: string;
    check_out: string;
    number_of_guests: number;
    guest_details: GuestDetails;
    special_requests?: string;
}

export interface CancelReservationData {
    cancellation_reason: string;
}

export interface CheckAvailabilityParams {
    hotel_id: string;
    room_id: string;
    check_in: string;
    check_out: string;
}

export interface AvailabilityResponse {
    available: boolean;
    message?: string;
}

export interface ReservationFilters {
    status?: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';
    from_date?: string;
    to_date?: string;
    hotel_id?: string;
}

export interface CalendarParams {
    hotel_id: string;
    year: number;
    month: number;
}
