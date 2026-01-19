import {
  Payment,
  CreatePaymentData,
  RefundData,
  PaymentFilters,
  PaymentTransaction,
  EarningsData,
  PaymentStatistics,
} from "../../domain/entities/Payment";
import { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import { PaginatedResponse } from "../../domain/repositories/ReservationRepository";
import { httpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../../config/api.config";

export class HttpPaymentRepository implements PaymentRepository {
  async createPayment(data: CreatePaymentData): Promise<{ message: string; data: Payment }> {
    try {
      const response = await httpClient.post<{ message: string; data: Payment }>(
        API_ENDPOINTS.payments.create,
        data
      );
      return response;
    } catch (error: any) {
      console.error('Error al crear pago:', error);
      throw new Error(error.message || 'Error al procesar el pago');
    }
  }

  async getMyPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
    try {
      const response = await httpClient.get<PaginatedResponse<Payment>>(
        API_ENDPOINTS.payments.getAll,
        filters
      );
      return response;
    } catch (error: any) {
      console.error('Error al obtener pagos:', error);
      throw new Error(error.message || 'Error al cargar los pagos');
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    try {
      const response = await httpClient.get<Payment>(
        API_ENDPOINTS.payments.getById(id)
      );
      return response;
    } catch (error: any) {
      console.error(`Error al obtener pago ${id}:`, error);
      throw new Error(error.message || 'Error al cargar el pago');
    }
  }

  async verifyPaymentStatus(id: string): Promise<{ message: string; gateway_status: string; data: Payment }> {
    try {
      const response = await httpClient.post<{ message: string; gateway_status: string; data: Payment }>(
        API_ENDPOINTS.payments.verify(id),
        {}
      );
      return response;
    } catch (error: any) {
      console.error(`Error al verificar pago ${id}:`, error);
      throw new Error(error.message || 'Error al verificar el estado del pago');
    }
  }

  async getPaymentTransactions(id: string): Promise<PaginatedResponse<PaymentTransaction>> {
    try {
      const response = await httpClient.get<PaginatedResponse<PaymentTransaction>>(
        API_ENDPOINTS.payments.transactions(id)
      );
      return response;
    } catch (error: any) {
      console.error(`Error al obtener transacciones del pago ${id}:`, error);
      throw new Error(error.message || 'Error al cargar las transacciones');
    }
  }

  async processRefund(id: string, data: RefundData): Promise<{ message: string; data: Payment }> {
    try {
      const response = await httpClient.post<{ message: string; data: Payment }>(
        API_ENDPOINTS.payments.refund(id),
        data
      );
      return response;
    } catch (error: any) {
      console.error(`Error al procesar reembolso para pago ${id}:`, error);
      throw new Error(error.message || 'Error al procesar el reembolso');
    }
  }

  async getMyEarnings(filters?: PaymentFilters): Promise<EarningsData> {
    try {
      const response = await httpClient.get<EarningsData>(
        API_ENDPOINTS.payments.myEarnings,
        filters
      );
      return response;
    } catch (error: any) {
      console.error('Error al obtener ganancias:', error);
      throw new Error(error.message || 'Error al cargar las ganancias');
    }
  }

  async getPaymentStatistics(filters?: PaymentFilters): Promise<PaymentStatistics> {
    try {
      const response = await httpClient.get<PaymentStatistics>(
        API_ENDPOINTS.payments.statistics,
        filters
      );
      return response;
    } catch (error: any) {
      console.error('Error al obtener estadísticas de pagos:', error);
      throw new Error(error.message || 'Error al cargar las estadísticas');
    }
  }
}
