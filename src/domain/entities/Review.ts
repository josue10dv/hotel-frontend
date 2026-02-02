/**
 * Entidades y tipos para el módulo de Reseñas
 */

export interface RatingBreakdown {
    overall: number;
    cleanliness?: number;
    communication?: number;
    check_in?: number;
    accuracy?: number;
    location?: number;
    service?: number;
    value?: number;
}

export interface OwnerResponse {
    response: string;
    responded_at: string;
}

export interface ReviewResponse {
    owner_id: string;
    comment: string;
    created_at: string;
}

export interface UserInfo {
    username: string;
    first_name?: string;
    user_id?: string;
}

export interface HotelInfo {
    name: string;
    _id?: string;
}

export interface Review {
    id: string;
    _id?: string;
    hotel_id: string;
    hotel_name?: string;
    hotel_info?: HotelInfo;
    user_id: string;
    user_name: string;
    user_avatar: string | null;
    user_info?: UserInfo;
    reservation_id?: string;
    rating: number;
    rating_breakdown: RatingBreakdown;
    title?: string;
    comment: string;
    stay_date?: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    response?: ReviewResponse;
    owner_response?: OwnerResponse | null;
    status: 'pending' | 'approved' | 'rejected' | 'reported';
    is_verified: boolean;
    verified_stay?: boolean;
    helpful_count: number;
    unhelpful_count?: number;
    has_response?: boolean;
    created_at: string;
    updated_at?: string;
}

export interface CreateReviewData {
    hotel_id: string;
    reservation_id?: string;
    rating_breakdown: RatingBreakdown;
    title?: string;
    comment: string;
    stay_date?: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
}

export interface UpdateReviewData {
    title?: string;
    comment?: string;
    rating_breakdown?: RatingBreakdown;
    pros?: string[];
    cons?: string[];
    images?: string[];
}

export interface ReviewFilters {
    page?: number;
    page_size?: number;
    sort?: 'recent' | 'rating_high' | 'rating_low' | 'helpful';
    rating?: number;
    min_rating?: number;
}

export interface ReviewListResponse {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    average_rating: number;
    rating_distribution: Record<string, number>;
    results: Review[];
}

export interface ReviewStats {
    hotel_id: string;
    total_reviews: number;
    average_rating: number;
    rating_distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    aspect_ratings: {
        cleanliness: number;
        location: number;
        service: number;
        value: number;
    };
    category_averages?: RatingBreakdown;
    verified_reviews_count: number;
    verified_stays_percentage?: number;
    recent_reviews: Review[];
}

export interface RespondToReviewData {
    response: string;
    comment?: string;
}

export interface MarkHelpfulRequest {
    helpful: boolean;
}

export interface ReportReviewRequest {
    reason: 'spam' | 'offensive' | 'fake' | 'inappropriate' | 'other';
    comment?: string;
}

export interface MarkHelpfulData {
    is_helpful: boolean;
}

export interface ReportReviewData {
    reason: string;
    details: string;
}
