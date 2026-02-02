import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts';
import { useHostHotels, initialFormData, HotelFormData } from '../hooks/useHostHotels';
import {
    HotelStatsCards,
    HotelCard,
    HotelEmptyState,
    HotelDetailsModal,
    HotelFormModal,
    PropertyReservationsModal
} from '../components/host';

const availableAmenities = ['wifi', 'piscina', 'gym', 'restaurante', 'spa', 'estacionamiento', 'aire_acondicionado', 'bar', 'desayuno', 'room_service', 'pet_friendly', 'lavanderia'];

export default function HostPage() {
    const navigate = useNavigate();
    const { hotels, loading, error, isCreating, createHotel, updateHotel, deleteHotel } = useHostHotels();
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showReservationsModal, setShowReservationsModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [formData, setFormData] = useState<HotelFormData>(initialFormData);
    const [imageInput, setImageInput] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressKey]: value
                }
            }));
        } else if (name.startsWith('policies.')) {
            const policyKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                policies: {
                    ...prev.policies,
                    [policyKey]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng }
        }));
    };

    const handleAddGalleryImage = () => {
        if (imageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageInput.trim()]
            }));
            setImageInput('');
        }
    };

    const handleAddImageFiles = (files: File[]) => {
        setFormData(prev => ({
            ...prev,
            imageFiles: [...prev.imageFiles, ...files],
            images: [
                ...prev.images,
                ...files.map(file => URL.createObjectURL(file))
            ]
        }));
    };

    const handleRemoveGalleryImage = (index: number) => {
        setFormData(prev => {
            // Revocar URL si es un archivo local
            const imageUrl = prev.images[index];
            if (imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
            
            return {
                ...prev,
                images: prev.images.filter((_, i) => i !== index),
                imageFiles: prev.imageFiles.filter((_, i) => i !== index)
            };
        });
    };

    const handleViewDetails = (hotel: any) => {
        setSelectedHotel(hotel);
        setShowDetailsModal(true);
    };

    const handleDelete = (hotel: any) => {
        setSelectedHotel(hotel);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedHotel) return;

        setIsDeleting(true);
        setSubmitError(null);

        try {
            await deleteHotel(selectedHotel.id);
            setShowDeleteConfirm(false);
            setSelectedHotel(null);
        } catch (error: any) {
            setSubmitError(error.message || 'Error al eliminar el hotel');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (hotel: any) => {
        setSelectedHotel(hotel);
        setIsEditMode(true);
        setFormData({
            name: hotel.name,
            description: hotel.description,
            property_type: hotel.property_type || 'hotel',
            address: hotel.address,
            coordinates: hotel.location || hotel.address?.coordinates,
            images: hotel.images,
            imageFiles: [], // No hay archivos en modo edición, solo URLs
            amenities: hotel.amenities || [],
            services: hotel.services || [],
            policies: hotel.policies || {
                check_in_time: '15:00',
                check_out_time: '12:00',
                cancellation_policy: '',
                pet_policy: 'No se aceptan mascotas'
            },
            contact: hotel.contact
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        try {
            if (isEditMode && selectedHotel) {
                // Editar hotel existente
                await updateHotel(selectedHotel.id, formData);
            } else {
                // Crear nuevo hotel
                await createHotel(formData);
            }
            setShowModal(false);
            setIsEditMode(false);
            setSelectedHotel(null);
            setFormData(initialFormData);
        } catch (error: any) {
            setSubmitError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el hotel`);
            console.error(`Error ${isEditMode ? 'actualizando' : 'creando'} hotel:`, error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setSelectedHotel(null);
        setFormData(initialFormData);
        setSubmitError(null);
    };

    const handleManageRooms = (hotel: any) => {
        navigate(`/host/hotels/${hotel.id}/rooms`);
    };

    const handleViewReservations = (hotel: any) => {
        setSelectedHotel(hotel);
        setShowReservationsModal(true);
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Mis Hoteles</h1>
                    <p className="text-gray-600 text-lg">Gestiona tus propiedades y reservaciones desde un solo lugar</p>
                </div>

                {/* Tarjetas de Estadísticas */}
                <HotelStatsCards
                    hotelsCount={hotels.length}
                    activeReservations={0}
                    monthlyEarnings={0}
                />

                {/* Lista de Hoteles o Estado Vacío */}
                {hotels.length === 0 ? (
                    <HotelEmptyState onPublishClick={() => setShowModal(true)} />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-primary">Mis Propiedades</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-secondary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Hotel
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotels.map((hotel) => (
                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    onEdit={handleEdit}
                                    onViewDetails={handleViewDetails}
                                    onDelete={handleDelete}
                                    onViewReservations={handleViewReservations}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Modal de Detalles */}
                <HotelDetailsModal
                    hotel={selectedHotel}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedHotel(null);
                    }}
                    onEdit={() => {
                        setShowDetailsModal(false);
                        handleEdit(selectedHotel);
                    }}
                    onManageRooms={() => {
                        setShowDetailsModal(false);
                        handleManageRooms(selectedHotel);
                    }}
                />

                {/* Modal de Formulario */}
                <HotelFormModal
                    isOpen={showModal}
                    isEditMode={isEditMode}
                    formData={formData}
                    imageInput={imageInput}
                    isSubmitting={isCreating}
                    submitError={submitError}
                    availableAmenities={availableAmenities}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                    onImageInputChange={setImageInput}
                    onAddImage={handleAddGalleryImage}
                    onAddImageFiles={handleAddImageFiles}
                    onRemoveImage={handleRemoveGalleryImage}
                    onAmenityToggle={handleAmenityToggle}
                    onLocationSelect={handleLocationSelect}
                />

                {/* Modal de Confirmación de Eliminación */}
                {showDeleteConfirm && selectedHotel && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">¿Eliminar hotel?</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Estás a punto de eliminar <strong>{selectedHotel.name}</strong>.
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Esta acción no se puede deshacer. Todas las reservaciones asociadas serán canceladas.
                                    </p>
                                </div>
                            </div>

                            {submitError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{submitError}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setSelectedHotel(null);
                                        setSubmitError(null);
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Reservaciones */}
                {selectedHotel && (
                    <PropertyReservationsModal
                        isOpen={showReservationsModal}
                        hotelId={selectedHotel.id}
                        hotelName={selectedHotel.name}
                        onClose={() => {
                            setShowReservationsModal(false);
                            setSelectedHotel(null);
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}