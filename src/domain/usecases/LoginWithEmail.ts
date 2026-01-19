import { AuthCredentials, AuthResponse } from "../entities/User";
import { AuthRepository } from "../repositories/AuthRepository";

export class LoginWithEmail {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(credentials: AuthCredentials): Promise<AuthResponse> {
        if (!credentials.email || !credentials.password) {
            throw new Error('Email y contraseña son requeridos');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            throw new Error('Email no válido');
        }

        if (credentials.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        return this.authRepository.loginWithEmail(credentials);
    }
}
