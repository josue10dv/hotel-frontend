// Entidades para el módulo de Pagos
// Preparado para integración futura con el backend

export interface Payment {
    payment_id?: string;
    id: string;
    reservation_id: string;
    reservation?: {
        hotel_name: string;
        check_in_date: string;
        check_out_date: string;
    };
    user_email?: string;
    user_name?: string;
    hotel_name?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled' | 'processing';
    status_display?: string;
    payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
    payment_method_display?: string;
    payment_gateway: 'stripe' | 'paypal' | 'mercadopago';
    payment_gateway_display?: string;
    transaction_id?: string;
    gateway_payment_id?: string;
    billing_details?: {
        card_holder: string;
        card_last4?: string;
        card_brand?: string;
        billing_address?: {
            street: string;
            city: string;
            country: string;
            postal_code: string;
        };
    };
    description?: string;
    metadata?: Record<string, any>;
    error_code?: string;
    error_message?: string;
    is_completed?: boolean;
    is_refundable?: boolean;
    can_be_cancelled?: boolean;
    created_at: string;
    updated_at?: string;
    completed_at?: string;
    failed_at?: string;
    refunded_at?: string;
}

export interface CreatePaymentData {
    reservation_id: string;
    payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
    payment_gateway: 'stripe' | 'paypal' | 'mercadopago';
    payment_token: string;
    save_payment_method?: boolean;
    billing_details: {
        card_holder: string;
        billing_address: {
            street: string;
            city: string;
            country: string;
            postal_code: string;
        };
    };
    metadata?: Record<string, any>;
}

export interface RefundData {
    amount?: number;
    reason: string;
}

export interface PaymentFilters {
    status?: string;
    from_date?: string;
    to_date?: string;
}

export interface RefundRequest {
    reason: string;
    amount: number;
}

export interface RefundResponse {
    refund_id: string;
    payment_id: string;
    amount: number;
    status: string;
    reason: string;
    estimated_completion: string;
    created_at: string;
}

export interface OwnerEarnings {
    total_earnings: number;
    pending_payments: number;
    completed_payments: number;
    currency: string;
    period: {
        start: string;
        end: string;
    };
    breakdown_by_hotel: {
        hotel_id: string;
        hotel_name: string;
        earnings: number;
        reservations_count: number;
        average_per_reservation: number;
    }[];
    recent_transactions: {
        payment_id: string;
        reservation_id: string;
        hotel_name: string;
        guest_name: string;
        amount: number;
        status: string;
        created_at: string;
    }[];
}

export interface PaymentStatistics {
    total_spent: number;
    total_payments: number;
    successful_payments: number;
    failed_payments: number;
    average_payment: number;
    payment_methods: Record<string, number>;
    monthly_trend: {
        month: string;
        total: number;
        count: number;
    }[];
}

export interface PaymentTransaction {
    id: string;
    payment_id: string;
    transaction_type: 'charge' | 'refund';
    transaction_type_display: string;
    amount: number;
    status: 'success' | 'failed';
    status_display: string;
    gateway_transaction_id?: string;
    error_code?: string;
    error_message?: string;
    response_data?: Record<string, any>;
    notes?: string;
    is_successful: boolean;
    created_at: string;
}

export interface EarningsData {
    total_earnings: number;
    completed_payments: number;
    pending_payments: number;
    pending_amount: number;
    refunded_amount: number;
    currency: string;
    period: {
        from: string;
        to: string;
    };
}

export interface PaymentStatistics {
    total_payments: number;
    total_amount: number;
    completed_payments: number;
    completed_amount: number;
    pending_payments: number;
    pending_amount: number;
    failed_payments: number;
    refunded_payments: number;
    refunded_amount: number;
    currency: string;
}
