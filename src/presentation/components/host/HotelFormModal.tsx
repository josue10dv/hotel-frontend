import { HotelFormData } from '../../hooks/useHostHotels';
import { LocationPicker } from './LocationPicker';

interface HotelFormModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    formData: HotelFormData;
    imageInput: string;
    isSubmitting: boolean;
    submitError: string | null;
    availableAmenities: string[];
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onImageInputChange: (value: string) => void;
    onAddImage: () => void;
    onAddImageFiles: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
    onAmenityToggle: (amenity: string) => void;
    onLocationSelect: (lat: number, lng: number) => void;
}

export function HotelFormModal({
    isOpen,
    isEditMode,
    formData,
    imageInput,
    isSubmitting,
    submitError,
    availableAmenities,
    onClose,
    onSubmit,
    onInputChange,
    onImageInputChange,
    onAddImage,
    onAddImageFiles,
    onRemoveImage,
    onAmenityToggle,
    onLocationSelect
}: HotelFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Encabezado del Modal */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">
                        {isEditMode ? 'Editar Hotel' : 'Publicar Nuevo Hotel'}
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

                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    {/* Información Básica */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Información Básica</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Hotel *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Hotel Paradise"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={onInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all resize-none"
                                    placeholder="Un hotel de lujo frente al mar..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Precio por Noche *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                    <input
                                        type="number"
                                        name="min_price"
                                        value={formData.min_price || ''}
                                        onChange={onInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                        placeholder="99.99"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Precio mínimo por noche en USD</p>
                            </div>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Dirección</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={onInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Av. Principal 123"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={onInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Quito"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado/Región *</label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={onInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Pichincha"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">País *</label>
                                <input
                                    type="text"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={onInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Ecuador"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                                <input
                                    type="text"
                                    name="address.postal_code"
                                    value={formData.address.postal_code}
                                    onChange={onInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="77500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ubicación en Mapa */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Ubicación</h3>
                        <LocationPicker
                            initialLat={formData.coordinates?.lat}
                            initialLng={formData.coordinates?.lng}
                            onLocationSelect={onLocationSelect}
                        />
                    </div>

                    {/* Imágenes */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Imágenes</h3>

                        {/* Subir Archivos */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subir Fotos</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-secondary transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length > 0) {
                                            onAddImageFiles(files);
                                        }
                                        e.target.value = '';
                                    }}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="text-secondary font-semibold">Haz clic para subir</span> o arrastra y suelta
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 10MB</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* URL de Imágenes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">O agregar por URL</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="url"
                                    value={imageInput}
                                    onChange={(e) => onImageInputChange(e.target.value)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                <button
                                    type="button"
                                    onClick={onAddImage}
                                    className="bg-secondary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                                >
                                    Agregar
                                </button>
                            </div>

                            {/* Galería de Imágenes */}
                            {formData.images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Galería ({formData.images.length})</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Imagen ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-lg font-semibold">
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amenidades */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Amenidades</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {availableAmenities.map(amenity => (
                                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => onAmenityToggle(amenity)}
                                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{amenity.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Políticas */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Políticas del Hotel</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Check-in</label>
                                <input
                                    type="time"
                                    name="policies.check_in_time"
                                    value={formData.policies.check_in_time}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Check-out</label>
                                <input
                                    type="time"
                                    name="policies.check_out_time"
                                    value={formData.policies.check_out_time}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Política de Cancelación</label>
                                <input
                                    type="text"
                                    name="policies.cancellation_policy"
                                    value={formData.policies.cancellation_policy}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Cancelación gratuita hasta 24 horas antes"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Política de Mascotas</label>
                                <select
                                    name="policies.pet_policy"
                                    value={formData.policies.pet_policy}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                >
                                    <option value="No se aceptan mascotas">No se aceptan mascotas</option>
                                    <option value="Se aceptan mascotas pequeñas">Se aceptan mascotas pequeñas</option>
                                    <option value="Se aceptan mascotas medianas">Se aceptan mascotas medianas</option>
                                    <option value="Se aceptan todas las mascotas">Se aceptan todas las mascotas</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de Error */}
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {submitError}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (isEditMode ? 'Guardando...' : 'Publicando...') : (isEditMode ? 'Guardar Cambios' : 'Publicar Hotel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
