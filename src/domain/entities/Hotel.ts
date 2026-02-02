export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface Policies {
    check_in_time: string;
    check_out_time: string;
    cancellation_policy: string;
    pet_policy: string;
}

export interface Review {
    id: string;
    user_name: string;
    user_avatar: string;
    rating: number;
    comment: string;
    date: string;
}

export interface RatingInfo {
    title?: string;
    subtitle?: string;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Contact {
    phone: string;
    email: string;
    website?: string;
}

export interface Room {
    room_id: string;
    name: string;
    description: string;
    type: 'single' | 'double' | 'twin' | 'suite' | 'deluxe' | 'family' | 'studio';
    capacity: number;
    price_per_night: number;
    available: boolean;
    amenities: string[];
    images: string[];
}

export interface Hotel {
    id: string;
    _id?: string;
    owner_id: string;
    name: string;
    description: string;
    property_type: 'hotel' | 'apartment' | 'house' | 'room' | 'resort' | 'hostel';
    category?: string;
    address: Address & { coordinates?: Coordinates };
    rooms?: Room[];
    amenities: string[];
    services?: string[];
    images: string[];
    policies: Policies;
    contact?: Contact;
    rating: number;
    total_reviews?: number;
    min_price?: number;
    reviews?: Review[];
    ratingInfo?: RatingInfo;
    location?: Location;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

