export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  hotels: {
    getAll: '/hotels/',
    getById: (id: string) => `/hotels/${id}/`,
    search: '/hotels/search/',
    filterByCategory: '/hotels/category/',
    myHotels: '/hotels/my-hotels/',
    create: '/hotels/',
    update: (id: string) => `/hotels/${id}/`,
    delete: (id: string) => `/hotels/${id}/`,
    addRoom: (id: string) => `/hotels/${id}/add-room/`,
    updateRoom: (id: string, roomId: string) => `/hotels/${id}/update-room/${roomId}/`,
    deleteRoom: (id: string, roomId: string) => `/hotels/${id}/delete-room/${roomId}/`,
  },
  auth: {
    login: '/auth/login/',
    register: '/users/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    me: '/users/me/',
    updateUser: (id: string) => `/users/${id}/`,
    changePassword: (id: string) => `/users/${id}/change-password/`,
  },
  reservations: {
    create: '/reservations/',
    getAll: '/reservations/',
    getById: (id: string) => `/reservations/${id}/`,
    cancel: (id: string) => `/reservations/${id}/cancel/`,
    checkAvailability: '/reservations/check-availability/',
    myProperties: '/reservations/my-properties/',
    confirm: (id: string) => `/reservations/${id}/confirm/`,
    reject: (id: string) => `/reservations/${id}/reject/`,
    complete: (id: string) => `/reservations/${id}/complete/`,
    calendar: '/reservations/calendar/',
  },
  payments: {
    create: '/payments/',
    getAll: '/payments/',
    getById: (id: string) => `/payments/${id}/`,
    verify: (id: string) => `/payments/${id}/verify/`,
    transactions: (id: string) => `/payments/${id}/transactions/`,
    refund: (id: string) => `/payments/${id}/refund/`,
    myEarnings: '/payments/my-earnings/',
    statistics: '/payments/statistics/',
  },
};
