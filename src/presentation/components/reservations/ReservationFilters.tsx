import { FilterStatus } from '../../hooks/useMyReservations';

/**
 * Componente ReservationFilters
 * Barra de filtros y búsqueda para las reservaciones
 * Incluye campo de búsqueda y botones de filtro por estado
 */
interface ReservationFiltersProps {
    searchQuery: string;
    filterStatus: FilterStatus;
    onSearchChange: (query: string) => void;
    onFilterChange: (status: FilterStatus) => void;
}

export function ReservationFilters({
    searchQuery,
    filterStatus,
    onSearchChange,
    onFilterChange
}: ReservationFiltersProps) {
    const filters = [
        { value: 'all' as FilterStatus, label: 'Todas', icon: '📋' },
        { value: 'pending' as FilterStatus, label: 'Pendientes', icon: '⏳' },
        { value: 'confirmed' as FilterStatus, label: 'Confirmadas', icon: '✅' },
        { value: 'completed' as FilterStatus, label: 'Completadas', icon: '🎉' },
        { value: 'cancelled' as FilterStatus, label: 'Canceladas', icon: '❌' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Barra de Búsqueda */}
                <div className="w-full lg:w-96">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por hotel, habitación..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Filtros por Estado */}
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => onFilterChange(filter.value)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === filter.value
                                    ? 'bg-secondary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span className="mr-2">{filter.icon}</span>
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
