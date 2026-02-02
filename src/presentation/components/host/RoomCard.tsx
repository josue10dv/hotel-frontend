import { Room } from '../../../domain/entities/Hotel';

interface RoomCardProps {
    room: Room;
    onEdit: (room: Room) => void;
    onDelete: (roomId: string) => void;
}

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
    const getRoomTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            single: 'Individual',
            double: 'Doble',
            twin: 'Twin',
            suite: 'Suite',
            deluxe: 'Deluxe',
            family: 'Familiar',
            studio: 'Estudio'
        };
        return types[type] || type;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">{room.name}</h3>
                        <p className="text-sm text-gray-500">{getRoomTypeLabel(room.type)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${room.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {room.available ? 'Disponible' : 'No disponible'}
                    </span>
                </div>

                {room.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{room.capacity} personas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-secondary">${room.price_per_night}/noche</span>
                    </div>
                </div>

                {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {room.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    {amenity}
                                </span>
                            ))}
                            {room.amenities.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                    +{room.amenities.length - 3} más
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onEdit(room)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(room.room_id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
