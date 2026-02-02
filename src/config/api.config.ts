export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Para cookies (refresh token)
};

// Helper para construir URLs completas de archivos estáticos (imágenes, etc.)
export const getMediaUrl = (path: string): string => {
    if (!path) return '';
    // Si ya es una URL completa, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Construir URL completa desde la raíz del backend
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const backendRoot = baseUrl.replace('/api', ''); // Remover /api para obtener la raíz
    return `${backendRoot}${path}`;
};

export const API_ENDPOINTS = {
    // Autenticación
    auth: {
        login: '/auth/login/',
        refresh: '/auth/refresh/',
        logout: '/auth/logout/',
    },

    // Usuarios
    users: {
        register: '/users/',
        list: '/users/',
        getById: (id: string) => `/users/${id}/`,
        me: '/users/me/',
        update: (id: string) => `/users/${id}/`,
        changePassword: (id: string) => `/users/${id}/change_password/`,
        deactivate: (id: string) => `/users/${id}/`,
    },

    // Hoteles
    hotels: {
        create: '/hotels/',
        list: '/hotels/',
        getById: (id: string) => `/hotels/${id}/`,
        update: (id: string) => `/hotels/${id}/`,
        delete: (id: string) => `/hotels/${id}/`,
        myHotels: '/hotels/my-hotels/',
        search: '/hotels/search/',
        addRoom: (id: string) => `/hotels/${id}/add-room/`,
        updateRoom: (id: string, roomId: string) => `/hotels/${id}/update-room/${roomId}/`,
        deleteRoom: (id: string, roomId: string) => `/hotels/${id}/delete-room/${roomId}/`,
    },

    // Reservaciones
    reservations: {
        create: '/reservations/',
        myReservations: '/reservations/',
        getById: (id: string) => `/reservations/${id}/`,
        cancel: (id: string) => `/reservations/${id}/cancel/`,
        myProperties: '/reservations/my-properties/',
        confirm: (id: string) => `/reservations/${id}/confirm/`,
        reject: (id: string) => `/reservations/${id}/reject/`,
        complete: (id: string) => `/reservations/${id}/complete/`,
        checkAvailability: '/reservations/check-availability/',
        calendar: '/reservations/calendar/',
    },

    // Pagos
    payments: {
        create: '/payments/',
        myPayments: '/payments/',
        getById: (id: string) => `/payments/${id}/`,
        verify: (id: string) => `/payments/${id}/verify/`,
        transactions: (id: string) => `/payments/${id}/transactions/`,
        refund: (id: string) => `/payments/${id}/refund/`,
        myEarnings: '/payments/my-earnings/',
        statistics: '/payments/statistics/',
    },

    // Reseñas
    reviews: {
        create: '/reviews/',
        getById: (id: string) => `/reviews/${id}/`,
        update: (id: string) => `/reviews/${id}/`,
        delete: (id: string) => `/reviews/${id}/`,
        hotelReviews: (hotelId: string) => `/reviews/hotel/${hotelId}/`,
        myReviews: '/reviews/my-reviews/',
        stats: (hotelId: string) => `/reviews/stats/${hotelId}/`,
        respond: (id: string) => `/reviews/${id}/respond/`,
        markHelpful: (id: string) => `/reviews/${id}/helpful/`,
        report: (id: string) => `/reviews/${id}/report/`,
    },

    // Wishlist
    wishlist: {
        list: '/wishlist/',
        add: '/wishlist/add/',
        remove: (hotelId: string) => `/wishlist/remove/${hotelId}/`,
        check: (hotelId: string) => `/wishlist/check/${hotelId}/`,
        clear: '/wishlist/clear/',
    },

    // Notificaciones
    notifications: {
        list: '/notifications/',
        markAsRead: (id: string) => `/notifications/${id}/read/`,
        markAllAsRead: '/notifications/read-all/',
        delete: (id: string) => `/notifications/${id}/`,
    },

    // Hoteles - Búsqueda avanzada
    search: {
        simple: '/hotels/search/',
        advanced: '/hotels/advanced-search/',
        availability: (hotelId: string) => `/hotels/${hotelId}/availability/`,
    },

    // Estadísticas Dashboard
    dashboard: {
        guestStats: '/users/dashboard-stats/',
        ownerStats: '/users/owner-dashboard-stats/',
    },

    // Salud del sistema
    health: {
        health: '/health/',
        ready: '/ready/',
        live: '/live/',
    },
};
