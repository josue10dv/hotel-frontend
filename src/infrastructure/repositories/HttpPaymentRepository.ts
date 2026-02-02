import {
    Payment,
    CreatePaymentData,
    RefundRequest,
    RefundResponse,
    PaymentFilters,
    PaymentTransaction,
    EarningsData,
    PaymentStatistics,
    OwnerEarnings,
} from "../../domain/entities/Payment";
import { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import { PaginatedResponse } from "../../domain/repositories/ReservationRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpPaymentRepository implements PaymentRepository {
    async createPayment(data: CreatePaymentData): Promise<Payment> {
        try {
            const response = await httpClient.post<{ message: string; data: Payment }>(
                API_ENDPOINTS.payments.create,
                data
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al crear pago:', error);

            // Manejo de errores específicos de pago
            if (error.data && typeof error.data === 'object') {
                const messages = Object.values(error.data).flat().join('\n');
                throw new Error(messages);
            }

            throw new Error(error.message || 'No se pudo procesar el pago');
        }
    }

    async getMyPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
        try {
            const queryParams: Record<string, string> = {};

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams[key] = String(value);
                    }
                });
            }

            const response = await httpClient.get<{ count: number; payments: Payment[] }>(
                API_ENDPOINTS.payments.myPayments,
                queryParams
            );

            return {
                count: response.count,
                results: response.payments,
            };
        } catch (error: any) {
            console.error('Error al obtener mis pagos:', error);
            throw new Error(error.message || 'No se pudieron cargar tus pagos');
        }
    }

    async getPaymentById(id: string): Promise<Payment> {
        try {
            const payment = await httpClient.get<Payment>(
                API_ENDPOINTS.payments.getById(id)
            );
            return payment;
        } catch (error: any) {
            console.error(`Error al obtener pago ${id}:`, error);
            throw new Error(error.message || 'No se pudo cargar el pago');
        }
    }

    async verifyPaymentStatus(id: string): Promise<{ message: string; gateway_status: string; data: Payment }> {
        try {
            const response = await httpClient.post<{ data: { payment_id: string; status: string; gateway_status: string; verified_at: string } }>(
                API_ENDPOINTS.payments.verify(id),
                {}
            );

            // Transformar la respuesta para que coincida con la interfaz
            return {
                message: 'Pago verificado',
                gateway_status: response.data.gateway_status,
                data: { status: response.data.status } as any, // Simplificado, en producción cargar el pago completo
            };
        } catch (error: any) {
            console.error('Error al verificar estado del pago:', error);
            throw new Error(error.message || 'No se pudo verificar el estado del pago');
        }
    }

    async getPaymentTransactions(id: string): Promise<PaginatedResponse<PaymentTransaction>> {
        try {
            const response = await httpClient.get<{ count: number; transactions: PaymentTransaction[] }>(
                API_ENDPOINTS.payments.transactions(id)
            );

            return {
                count: response.count,
                results: response.transactions,
            };
        } catch (error: any) {
            console.error('Error al obtener transacciones del pago:', error);
            throw new Error(error.message || 'No se pudieron cargar las transacciones');
        }
    }

    // Endpoints para propietarios
    async processRefund(id: string, data: RefundRequest): Promise<RefundResponse> {
        try {
            const response = await httpClient.post<{ message: string; data: RefundResponse }>(
                API_ENDPOINTS.payments.refund(id),
                data
            );

            return response.data;
        } catch (error: any) {
            console.error('Error al procesar reembolso:', error);
            throw new Error(error.message || 'No se pudo procesar el reembolso');
        }
    }

    async getMyEarnings(startDate?: string, endDate?: string, hotelId?: string): Promise<OwnerEarnings> {
        try {
            const params: Record<string, any> = {};

            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            if (hotelId) params.hotel_id = hotelId;

            const response = await httpClient.get<{ data: OwnerEarnings }>(
                API_ENDPOINTS.payments.myEarnings,
                { params }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error al obtener ganancias:', error);
            throw new Error(error.message || 'No se pudieron cargar las ganancias');
        }
    }

    async getPaymentStatistics(period?: 'week' | 'month' | 'year'): Promise<PaymentStatistics> {
        try {
            const params: Record<string, any> = {};
            if (period) params.period = period;

            const response = await httpClient.get<{ data: PaymentStatistics }>(
                API_ENDPOINTS.payments.statistics,
                { params }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error al obtener estadísticas de pagos:', error);
            throw new Error(error.message || 'No se pudieron cargar las estadísticas');
        }
    }
}
