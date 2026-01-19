import { HttpAuthRepository } from "../repositories/HttpAuthRepository";
import { AuthRepository } from "../../domain/repositories/AuthRepository";

class AuthService {
  private static instance: AuthService;
  private repository: AuthRepository;

  private constructor() {
    this.repository = new HttpAuthRepository();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getRepository(): AuthRepository {
    return this.repository;
  }
}

export const authService = AuthService.getInstance();
