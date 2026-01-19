import {
  Payment,
  CreatePaymentData,
  RefundData,
  PaymentFilters,
  PaymentTransaction,
  EarningsData,
  PaymentStatistics,
} from "../entities/Payment";
import { PaginatedResponse } from "./ReservationRepository";

export interface PaymentRepository {
  createPayment(data: CreatePaymentData): Promise<{ message: string; data: Payment }>;
  getMyPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>>;
  getPaymentById(id: string): Promise<Payment>;
  verifyPaymentStatus(id: string): Promise<{ message: string; gateway_status: string; data: Payment }>;
  getPaymentTransactions(id: string): Promise<PaginatedResponse<PaymentTransaction>>;
  
  // Endpoints para propietarios
  processRefund(id: string, data: RefundData): Promise<{ message: string; data: Payment }>;
  getMyEarnings(filters?: PaymentFilters): Promise<EarningsData>;
  getPaymentStatistics(filters?: PaymentFilters): Promise<PaymentStatistics>;
}
