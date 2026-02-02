/**
 * Componente HotelStatsCards
 * Muestra las estadísticas principales del anfitrión (hoteles publicados, reservaciones activas, ganancias)
 */
interface HotelStatsCardsProps {
    hotelsCount: number;
    activeReservations?: number;
    monthlyEarnings?: number;
}

export function HotelStatsCards({
    hotelsCount,
    activeReservations = 0,
    monthlyEarnings = 0
}: HotelStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Hoteles Publicados */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div className="text-xs text-secondary font-medium bg-secondary/10 px-3 py-1 rounded-full">Activo</div>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">{hotelsCount}</h3>
                <p className="text-gray-600 text-sm">Hoteles Publicados</p>
            </div>

            {/* Reservaciones Activas */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">Hoy</div>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">{activeReservations}</h3>
                <p className="text-gray-600 text-sm">Reservaciones Activas</p>
            </div>

            {/* Ganancias del Mes */}
            <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 shadow-sm text-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Enero</div>
                </div>
                <h3 className="text-3xl font-bold mb-1">${monthlyEarnings.toLocaleString()}</h3>
                <p className="text-white/90 text-sm">Ganancias este mes</p>
            </div>
        </div>
    );
}
