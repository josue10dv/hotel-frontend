export interface GuestInfo {
  adults: number;
  children: number;
}

export interface Reservation {
  id: string;
  hotel_id: string;
  hotel_name: string;
  room_id: string;
  room_number: string;
  room_type?: string;
  guest_id: string;
  owner_id?: string;
  check_in: string;
  check_out: string;
  guests: GuestInfo;
  total_nights: number;
  price_per_night: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';
  special_requests?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
}

export interface CreateReservationData {
  hotel_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: GuestInfo;
  special_requests?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
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
  message: string;
}

export interface ReservationFilters {
  status?: string;
  from_date?: string;
  to_date?: string;
  hotel_id?: string;
}

export interface CalendarParams {
  hotel_id: string;
  year: number;
  month: number;
}
