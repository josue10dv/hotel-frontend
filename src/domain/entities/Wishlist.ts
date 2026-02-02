export interface Wishlist {
    user_id: string;
    hotels: WishlistHotel[];
}

export interface WishlistHotel {
    id: string;
    name: string;
    description: string;
    property_type: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    location: {
        lat: number;
        lng: number;
    };
    images: string[];
    rating: number;
    total_reviews: number;
    amenities: string[];
    services: string[];
    is_active: boolean;
}

export interface WishlistAddRequest {
    hotel_id: string;
}

export interface WishlistCheckResponse {
    is_favorite: boolean;
}
