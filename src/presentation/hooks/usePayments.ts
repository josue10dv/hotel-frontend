import { useState } from "react";
import { paymentService } from "../../infrastructure/services/PaymentService";
import {
    Payment,
    CreatePaymentData,
    RefundData,
    PaymentFilters,
    PaymentTransaction,
    EarningsData,
    PaymentStatistics,
} from "../../domain/entities/Payment";

export function usePayments() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

    const createPayment = async (data: CreatePaymentData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().createPayment(data);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al procesar pago');
            console.error('Error al procesar pago:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMyPayments = async (filters?: PaymentFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().getMyPayments(filters);
            setPayments(response.data || response.results || []);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al cargar pagos');
            console.error('Error al cargar pagos:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPaymentById = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const payment = await paymentService.getRepository().getPaymentById(id);
            setCurrentPayment(payment);
            return payment;
        } catch (err: any) {
            setError(err.message || 'Error al cargar pago');
            console.error('Error al cargar pago:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyPaymentStatus = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().verifyPaymentStatus(id);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al verificar estado del pago');
            console.error('Error al verificar estado del pago:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPaymentTransactions = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().getPaymentTransactions(id);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al cargar transacciones');
            console.error('Error al cargar transacciones:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const processRefund = async (id: string, data: RefundData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().processRefund(id, data);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al procesar reembolso');
            console.error('Error al procesar reembolso:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMyEarnings = async (filters?: PaymentFilters): Promise<EarningsData> => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().getMyEarnings(filters);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al cargar ganancias');
            console.error('Error al cargar ganancias:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPaymentStatistics = async (filters?: PaymentFilters): Promise<PaymentStatistics> => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getRepository().getPaymentStatistics(filters);
            return response;
        } catch (err: any) {
            setError(err.message || 'Error al cargar estadísticas');
            console.error('Error al cargar estadísticas:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        payments,
        currentPayment,
        createPayment,
        getMyPayments,
        getPaymentById,
        verifyPaymentStatus,
        getPaymentTransactions,
        processRefund,
        getMyEarnings,
        getPaymentStatistics,
    };
}
