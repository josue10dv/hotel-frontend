/**
 * Componente ReservationStatsCards
 * Muestra las estadísticas resumidas de las reservaciones por estado
 */
interface ReservationStatsCardsProps {
    stats: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
    };
}

export function ReservationStatsCards({ stats }: ReservationStatsCardsProps) {
    const statsConfig = [
        { label: 'Total', count: stats.total, color: 'blue' },
        { label: 'Pendientes', count: stats.pending, color: 'yellow' },
        { label: 'Confirmadas', count: stats.confirmed, color: 'green' },
        { label: 'Completadas', count: stats.completed, color: 'purple' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {statsConfig.map((stat) => (
                <div
                    key={stat.label}
                    className={`bg-${stat.color}-50 rounded-xl p-4 border border-${stat.color}-100`}
                >
                    <p className={`text-${stat.color}-600 text-sm font-medium mb-1`}>
                        {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-primary">{stat.count}</p>
                </div>
            ))}
        </div>
    );
}
