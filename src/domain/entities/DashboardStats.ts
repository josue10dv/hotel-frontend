export interface GuestDashboardStats {
    total_reservations: number;
    upcoming_reservations: number;
    total_spent: number;
    favorite_hotels_count: number;
    reviews_written: number;
}

export interface OwnerDashboardStats {
    total_hotels: number;
    total_rooms: number;
    active_reservations: number;
    monthly_earnings: number;
    total_reviews: number;
    average_rating: number;
    occupancy_rate: number;
}
