import { API_CONFIG } from '../../config/api.config';

export interface HttpError {
    message: string;
    status?: number;
    data?: any;
}

export class HttpClient {
    private baseURL: string;
    private timeout: number;
    private headers: Record<string, string>;
    private withCredentials: boolean;

    constructor(
        baseURL: string = API_CONFIG.baseURL,
        timeout: number = API_CONFIG.timeout,
        headers: Record<string, string> = API_CONFIG.headers,
        withCredentials: boolean = API_CONFIG.withCredentials
    ) {
        this.baseURL = baseURL;
        this.timeout = timeout;
        this.headers = headers;
        this.withCredentials = withCredentials;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const token = localStorage.getItem('access_token');
        const requestHeaders: Record<string, string> = {
            ...this.headers,
            ...options.headers as Record<string, string>,
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: requestHeaders,
                credentials: this.withCredentials ? 'include' : 'same-origin',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Manejar token expirado
            if (response.status === 401 && token) {
                const refreshed = await this.handleTokenRefresh();
                if (refreshed) {
                    // Reintentar la petición original con el nuevo token
                    return this.request<T>(endpoint, options);
                }
                // Si el refresh falló, limpiar y lanzar error
                this.clearAuth();
                throw {
                    message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
                    status: 401,
                } as HttpError;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw {
                    message: errorData.error || errorData.detail || errorData.message || `HTTP Error: ${response.status}`,
                    status: response.status,
                    data: errorData,
                } as HttpError;
            }

            // Manejar respuestas sin contenido
            if (response.status === 204 || response.status === 205) {
                return {} as T;
            }

            const data = await response.json();

            // La API puede retornar { data: {...} } o directamente el objeto
            return data.data !== undefined ? data.data : data;
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw {
                    message: 'La solicitud ha excedido el tiempo de espera',
                    status: 408,
                } as HttpError;
            }

            if (error.message && error.status !== undefined) {
                throw error as HttpError;
            }

            throw {
                message: error.message || 'Error de red. Verifica tu conexión.',
                status: 0,
            } as HttpError;
        }
    }

    private async handleTokenRefresh(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh/`, {
                method: 'POST',
                headers: this.headers,
                credentials: 'include', // Importante para enviar la cookie con el refresh token
            });

            if (response.ok) {
                const data = await response.json();
                const newAccessToken = data.access || data.data?.access;
                if (newAccessToken) {
                    localStorage.setItem('access_token', newAccessToken);
                    return true;
                }
            }

            this.clearAuth();
            return false;
        } catch {
            this.clearAuth();
            return false;
        }
    }

    private clearAuth(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const queryString = params
            ? '?' + new URLSearchParams(params).toString()
            : '';
        return this.request<T>(`${endpoint}${queryString}`, {
            method: 'GET',
        });
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    setAuthToken(token: string) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    removeAuthToken() {
        delete this.headers['Authorization'];
    }
}

export const httpClient = new HttpClient();
