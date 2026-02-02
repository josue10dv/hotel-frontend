import { Room } from '../../../domain/entities/Hotel';

interface RoomFormModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    room: Partial<Room> | null;
    onClose: () => void;
    onSubmit: (data: Partial<Room>) => void;
    isSubmitting: boolean;
    error: string | null;
}

const roomTypes = [
    { value: 'single', label: 'Individual' },
    { value: 'double', label: 'Doble' },
    { value: 'twin', label: 'Twin' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'family', label: 'Familiar' },
    { value: 'studio', label: 'Estudio' }
];

const commonAmenities = [
    'Cama King', 'Cama Queen', 'Cama Individual', 'TV', 'WiFi', 'Aire Acondicionado',
    'Mini Bar', 'Caja Fuerte', 'Escritorio', 'Balcón', 'Vista al Mar', 'Bañera',
    'Ducha', 'Secador de Pelo', 'Cafetera', 'Refrigerador'
];

export function RoomFormModal({
    isOpen,
    isEditMode,
    room,
    onClose,
    onSubmit,
    isSubmitting,
    error
}: RoomFormModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const selectedAmenities: string[] = [];
        formData.getAll('amenities').forEach(a => selectedAmenities.push(a as string));

        const roomData: Partial<Room> = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            type: formData.get('type') as Room['type'],
            capacity: parseInt(formData.get('capacity') as string),
            price_per_night: parseFloat(formData.get('price_per_night') as string),
            available: formData.get('available') === 'true',
            amenities: selectedAmenities,
        };

        onSubmit(roomData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-primary">
                            {isEditMode ? 'Editar Habitación' : 'Nueva Habitación'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Habitación *
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                defaultValue={room?.name || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Ej: Habitación Deluxe con Vista al Mar"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Habitación *
                            </label>
                            <select
                                name="type"
                                required
                                defaultValue={room?.type || 'double'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                            >
                                {roomTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacidad (personas) *
                            </label>
                            <input
                                name="capacity"
                                type="number"
                                min="1"
                                max="20"
                                required
                                defaultValue={room?.capacity || 2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Precio por Noche (USD) *
                            </label>
                            <input
                                name="price_per_night"
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                defaultValue={room?.price_per_night || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="100.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                name="available"
                                defaultValue={room?.available !== undefined ? String(room.available) : 'true'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                            >
                                <option value="true">Disponible</option>
                                <option value="false">No Disponible</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={room?.description || ''}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Describe las características de esta habitación..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenidades
                            </label>
                            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                                {commonAmenities.map(amenity => (
                                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value={amenity}
                                            defaultChecked={room?.amenities?.includes(amenity)}
                                            className="rounded text-secondary focus:ring-secondary"
                                        />
                                        <span className="text-sm text-gray-700">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isEditMode ? 'Guardando...' : 'Creando...'}
                                </>
                            ) : (
                                isEditMode ? 'Guardar Cambios' : 'Crear Habitación'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
