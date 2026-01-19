import { HttpReservationRepository } from "../repositories/HttpReservationRepository";
import { ReservationRepository } from "../../domain/repositories/ReservationRepository";

class ReservationService {
  private static instance: ReservationService;
  private repository: ReservationRepository;

  private constructor() {
    this.repository = new HttpReservationRepository();
  }

  public static getInstance(): ReservationService {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }
    return ReservationService.instance;
  }

  public getRepository(): ReservationRepository {
    return this.repository;
  }
}

export const reservationService = ReservationService.getInstance();
