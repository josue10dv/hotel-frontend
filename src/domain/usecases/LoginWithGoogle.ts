import { AuthResponse } from "../entities/User";
import { AuthRepository } from "../repositories/AuthRepository";

export class LoginWithGoogle {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<AuthResponse> {
    return this.authRepository.loginWithGoogle();
  }
}
