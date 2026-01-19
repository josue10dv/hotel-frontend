export interface Payment {
  id: string;
  reservation_id: string;
  user_email: string;
  user_name: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  status_display: string;
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  payment_method_display: string;
  payment_gateway: 'stripe' | 'paypal' | 'mercadopago';
  payment_gateway_display: string;
  gateway_payment_id?: string;
  description: string;
  metadata?: Record<string, any>;
  error_code?: string;
  error_message?: string;
  is_completed: boolean;
  is_refundable: boolean;
  can_be_cancelled: boolean;
  created_at: string;
  updated_at: string;
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
