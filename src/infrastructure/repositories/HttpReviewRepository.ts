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
} from "../../domain/entities/Review";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";
import { PaginatedResponse } from "../../domain/repositories/ReservationRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpReviewRepository implements ReviewRepository {
    // CRUD básico
    async createReview(data: CreateReviewData): Promise<Review> {
        try {
            const response = await httpClient.post<{ message: string; data: Review }>(
                API_ENDPOINTS.reviews.create,
                data
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al crear reseña:', error);

            // Manejar errores de validación
            if (error.data && typeof error.data === 'object') {
                const messages = Object.entries(error.data)
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join('\n');
                throw new Error(messages);
            }

            throw new Error(error.message || 'No se pudo crear la reseña');
        }
    }

    async getReview(id: string): Promise<Review> {
        try {
            const review = await httpClient.get<Review>(
                API_ENDPOINTS.reviews.getById(id)
            );
            return review;
        } catch (error: any) {
            console.error(`Error al obtener reseña ${id}:`, error);
            throw new Error(error.message || 'No se pudo cargar la reseña');
        }
    }

    async updateReview(id: string, data: UpdateReviewData): Promise<{ message: string; data: Review }> {
        try {
            const response = await httpClient.patch<{ message: string; data: Review }>(
                API_ENDPOINTS.reviews.update(id),
                data
            );
            return response;
        } catch (error: any) {
            console.error('Error al actualizar reseña:', error);
            throw new Error(error.message || 'No se pudo actualizar la reseña');
        }
    }

    async deleteReview(id: string): Promise<{ message: string }> {
        try {
            const response = await httpClient.delete<{ message: string }>(
                API_ENDPOINTS.reviews.delete(id)
            );
            return response;
        } catch (error: any) {
            console.error('Error al eliminar reseña:', error);
            throw new Error(error.message || 'No se pudo eliminar la reseña');
        }
    }

    // Consultas específicas
    async getHotelReviews(hotelId: string, filters?: ReviewFilters): Promise<ReviewListResponse> {
        try {
            const params: Record<string, any> = {};

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params[key] = value;
                    }
                });
            }

            const response = await httpClient.get<ReviewListResponse>(
                API_ENDPOINTS.reviews.hotelReviews(hotelId),
                { params }
            );

            return response;
        } catch (error: any) {
            console.error('Error al obtener reseñas del hotel:', error);
            throw new Error(error.message || 'No se pudieron cargar las reseñas');
        }
    }

    async getMyReviews(page: number = 1, pageSize: number = 10): Promise<ReviewListResponse> {
        try {
            return await httpClient.get<ReviewListResponse>(
                API_ENDPOINTS.reviews.myReviews,
                { params: { page, page_size: pageSize } }
            );
        } catch (error: any) {
            console.error('Error al obtener mis reseñas:', error);
            throw new Error(error.message || 'No se pudieron cargar tus reseñas');
        }
    }

    async getReviewStats(hotelId: string): Promise<ReviewStats> {
        try {
            return await httpClient.get<ReviewStats>(
                API_ENDPOINTS.reviews.stats(hotelId)
            );
        } catch (error: any) {
            console.error('Error al obtener estadísticas de reseñas:', error);
            throw new Error(error.message || 'No se pudieron cargar las estadísticas');
        }
    }

    // Acciones de propietario
    async respondToReview(id: string, data: RespondToReviewData): Promise<Review> {
        try {
            return await httpClient.post<Review>(
                API_ENDPOINTS.reviews.respond(id),
                data
            );
        } catch (error: any) {
            console.error('Error al responder reseña:', error);
            throw new Error(error.message || 'No se pudo publicar la respuesta');
        }
    }

    // Acciones de usuario
    async markReviewHelpful(id: string, data: MarkHelpfulRequest): Promise<{ helpful_count: number }> {
        try {
            return await httpClient.post<{ helpful_count: number }>(
                API_ENDPOINTS.reviews.markHelpful(id),
                data
            );
        } catch (error: any) {
            console.error('Error al marcar reseña como útil:', error);
            throw new Error(error.message || 'No se pudo registrar el voto');
        }
    }

    async reportReview(id: string, data: ReportReviewRequest): Promise<{ message: string }> {
        try {
            return await httpClient.post<{ message: string }>(
                API_ENDPOINTS.reviews.report(id),
                data
            );
        } catch (error: any) {
            console.error('Error al reportar reseña:', error);
            throw new Error(error.message || 'No se pudo reportar la reseña');
        }
    }
}
