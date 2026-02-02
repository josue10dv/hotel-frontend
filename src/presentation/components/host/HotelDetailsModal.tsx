import { getMediaUrl } from '../../../config/api.config';

/**
 * Componente HotelDetailsModal
 * Modal para visualizar todos los detalles de un hotel
 * Incluye galería, descripción, ubicación, amenidades, políticas e información del sistema
 */
interface HotelDetailsModalProps {
    hotel: any;
    onClose: () => void;
    onEdit: () => void;
    onManageRooms?: () => void;
}

export function HotelDetailsModal({ hotel, onClose, onEdit, onManageRooms }: HotelDetailsModalProps) {
    if (!hotel) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
                {/* Encabezado del Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-primary">{hotel.name}</h3>
                            <p className="text-sm text-gray-600">ID: {hotel.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido del Modal */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Galería de Imágenes */}
                    {hotel.images && hotel.images.length > 0 && (
                        <div>
                            <h4 className="text-lg font-bold text-primary mb-3">Galería</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {hotel.images.map((image: string, index: number) => (
                                    <div key={index} className="relative h-40 rounded-xl overflow-hidden">
                                        <img
                                            src={getMediaUrl(image)}
                                            alt={`${hotel.name} - Imagen ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Descripción */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-3">Descripción</h4>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-3">Ubicación</h4>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 space-y-3">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{hotel.address.street}</p>
                                    <p className="text-gray-700">
                                        {hotel.address.city}, {hotel.address.state} {hotel.address.postal_code}
                                    </p>
                                    <p className="text-gray-700">{hotel.address.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenidades */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div>
                            <h4 className="text-lg font-bold text-primary mb-3">Amenidades</h4>
                            <div className="bg-purple-50 rounded-xl p-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {hotel.amenities.map((amenity: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 capitalize text-sm">
                                                {amenity.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Políticas */}
                    {hotel.policies && (
                        <div>
                            <h4 className="text-lg font-bold text-primary mb-3">Políticas del Hotel</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hotel.policies.check_in_time && (
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="text-sm font-medium text-green-700">Check-in</span>
                                        </div>
                                        <p className="text-lg font-bold text-green-900">{hotel.policies.check_in_time}</p>
                                    </div>
                                )}
                                {hotel.policies.check_out_time && (
                                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="text-sm font-medium text-red-700">Check-out</span>
                                        </div>
                                        <p className="text-lg font-bold text-red-900">{hotel.policies.check_out_time}</p>
                                    </div>
                                )}
                                {hotel.policies.cancellation_policy && (
                                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 md:col-span-2">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <span className="text-sm font-medium text-yellow-700 block mb-1">
                                                    Política de Cancelación
                                                </span>
                                                <p className="text-gray-700">{hotel.policies.cancellation_policy}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {hotel.policies.pet_policy && (
                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 md:col-span-2">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <span className="text-sm font-medium text-orange-700 block mb-1">
                                                    Política de Mascotas
                                                </span>
                                                <p className="text-gray-700">{hotel.policies.pet_policy}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Información Adicional */}
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-3">Información del Sistema</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {hotel.created_at && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Fecha de Creación</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(hotel.created_at).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}
                            {hotel.updated_at && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Última Actualización</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(hotel.updated_at).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Categoría</span>
                                <span className="font-medium text-gray-900 capitalize">{hotel.category || 'Sin categoría'}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Calificación Promedio</span>
                                <span className="font-medium text-gray-900">
                                    {hotel.rating ? `${hotel.rating} ⭐` : 'Sin calificación'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie del Modal */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                    {onManageRooms && (
                        <button
                            onClick={onManageRooms}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Gestionar Habitaciones
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        className="flex-1 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Hotel
                    </button>
                </div>
            </div>
        </div>
    );
}
