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

    constructor(
        baseURL: string = API_CONFIG.baseURL,
        timeout: number = API_CONFIG.timeout,
        headers: Record<string, string> = API_CONFIG.headers
    ) {
        this.baseURL = baseURL;
        this.timeout = timeout;
        this.headers = headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const token = localStorage.getItem('auth_token');
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
                credentials: 'include',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 401) {
                const refreshed = await this.handleTokenRefresh();
                if (refreshed) {
                    return this.request<T>(endpoint, options);
                }
                throw {
                    message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
                    status: 401,
                } as HttpError;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw {
                    message: errorData.message || errorData.detail || `HTTP Error: ${response.status}`,
                    status: response.status,
                    data: errorData,
                } as HttpError;
            }

            if (response.status === 204 || response.status === 205) {
                return {} as T;
            }

            return await response.json();
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
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('auth_token', data.access);
                return true;
            }
            
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return false;
        } catch {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return false;
        }
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
