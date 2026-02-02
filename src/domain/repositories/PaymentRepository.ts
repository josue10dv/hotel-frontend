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
} from "../entities/Payment";
import { PaginatedResponse } from "./ReservationRepository";

export interface PaymentRepository {
    createPayment(data: CreatePaymentData): Promise<Payment>;
    getMyPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>>;
    getPaymentById(id: string): Promise<Payment>;
    verifyPaymentStatus(id: string): Promise<{ message: string; gateway_status: string; data: Payment }>;
    getPaymentTransactions(id: string): Promise<PaginatedResponse<PaymentTransaction>>;

    // Endpoints para propietarios
    processRefund(id: string, data: RefundRequest): Promise<RefundResponse>;
    getMyEarnings(startDate?: string, endDate?: string, hotelId?: string): Promise<OwnerEarnings>;
    getPaymentStatistics(period?: 'week' | 'month' | 'year'): Promise<PaymentStatistics>;
}
