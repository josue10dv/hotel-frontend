
interface HotelEmptyStateProps {
    onPublishClick: () => void;
}

export function HotelEmptyState({ onPublishClick }: HotelEmptyStateProps) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
            {/* Icono */}
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>

            {/* Título y Descripción */}
            <h3 className="text-2xl font-bold text-primary mb-3">No tienes hoteles publicados</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Comienza a ganar dinero publicando tu propiedad en nuestra plataforma. Es fácil, rápido y seguro.
            </p>

            {/* Botón de Acción */}
            <button
                onClick={onPublishClick}
                className="bg-secondary hover:bg-opacity-90 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                + Publicar mi primer hotel
            </button>
        </div>
    );
}
