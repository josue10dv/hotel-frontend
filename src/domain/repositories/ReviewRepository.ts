import {
    Review,
    CreateReviewData,
    UpdateReviewData,
    ReviewFilters,
    ReviewStats,
    ReviewListResponse,
    RespondToReviewData,
    MarkHelpfulRequest,
    ReportReviewRequest,
} from "../entities/Review";
import { PaginatedResponse } from "./ReservationRepository";

export interface ReviewRepository {
    // CRUD básico
    createReview(data: CreateReviewData): Promise<Review>;
    getReview(id: string): Promise<Review>;
    updateReview(id: string, data: UpdateReviewData): Promise<{ message: string; data: Review }>;
    deleteReview(id: string): Promise<{ message: string }>;

    // Consultas específicas
    getHotelReviews(hotelId: string, filters?: ReviewFilters): Promise<ReviewListResponse>;
    getMyReviews(page?: number, pageSize?: number): Promise<ReviewListResponse>;
    getReviewStats(hotelId: string): Promise<ReviewStats>;

    // Acciones de propietario
    respondToReview(id: string, data: RespondToReviewData): Promise<Review>;

    // Acciones de usuario
    markReviewHelpful(id: string, data: MarkHelpfulRequest): Promise<{ helpful_count: number }>;
    reportReview(id: string, data: ReportReviewRequest): Promise<{ message: string }>;
}
