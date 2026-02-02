import { Calendar } from 'lucide-react';
import { getMediaUrl } from '../../../config/api.config';

interface HotelCardProps {
    hotel: {
        id: string;
        name: string;
        description: string;
        images: string[];
        address: {
            city: string;
            country: string;
        };
    };
    onEdit: (hotel: any) => void;
    onViewDetails: (hotel: any) => void;
    onDelete: (hotel: any) => void;
    onViewReservations?: (hotel: any) => void;
}

export function HotelCard({ hotel, onEdit, onViewDetails, onDelete, onViewReservations }: HotelCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Imagen del Hotel */}
            <div className="relative h-48 bg-gray-200">
                <img
                    src={getMediaUrl(hotel.images[0] || '')}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Información del Hotel */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-primary mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    {hotel.address.city}, {hotel.address.country}
                </p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>

                {/* Botones de Acción */}
                <div className="mt-4 space-y-2">
                    {onViewReservations && (
                        <button
                            onClick={() => onViewReservations(hotel)}
                            className="w-full bg-secondary text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Ver Reservaciones
                        </button>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(hotel)}
                            className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onViewDetails(hotel)}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all"
                        >
                            Ver
                        </button>
                        <button
                            onClick={() => onDelete(hotel)}
                            className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all"
                            title="Eliminar hotel"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
