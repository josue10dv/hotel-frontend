import { HttpPaymentRepository } from "../repositories/HttpPaymentRepository";
import { PaymentRepository } from "../../domain/repositories/PaymentRepository";

class PaymentService {
  private static instance: PaymentService;
  private repository: PaymentRepository;

  private constructor() {
    this.repository = new HttpPaymentRepository();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public getRepository(): PaymentRepository {
    return this.repository;
  }
}

export const paymentService = PaymentService.getInstance();
