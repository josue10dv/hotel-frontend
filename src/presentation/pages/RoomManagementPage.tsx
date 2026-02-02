import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts';
import { RoomFormModal, RoomCard } from '../components/host';
import { Room, Hotel } from '../../domain/entities/Hotel';
import { hotelService } from '../../infrastructure/services/HotelService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';

export default function RoomManagementPage() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

    const fetchHotel = useCallback(async () => {
        if (!hotelId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await hotelService.getRepository().getHotelById(hotelId);
            if (data) {
                setHotel(data);
            } else {
                setError('Hotel no encontrado');
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar el hotel');
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    useEffect(() => {
        fetchHotel();
    }, [fetchHotel]);

    const handleAddRoom = async (roomData: Partial<Room>) => {
        if (!hotelId) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await hotelService.getRepository().addRoom(hotelId, roomData as any);
            await fetchHotel();
            setShowRoomModal(false);
            setSelectedRoom(null);
        } catch (err: any) {
            setSubmitError(err.message || 'Error al agregar habitación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditRoom = (room: Room) => {
        setSelectedRoom(room);
        setIsEditMode(true);
        setShowRoomModal(true);
    };

    const handleUpdateRoom = async (roomData: Partial<Room>) => {
        if (!hotelId || !selectedRoom) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await hotelService.getRepository().updateRoom(hotelId, selectedRoom.room_id, roomData as any);
            await fetchHotel();
            setShowRoomModal(false);
            setIsEditMode(false);
            setSelectedRoom(null);
        } catch (err: any) {
            setSubmitError(err.message || 'Error al actualizar habitación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRoom = (roomId: string) => {
        setRoomToDelete(roomId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteRoom = async () => {
        if (!hotelId || !roomToDelete) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await hotelService.getRepository().deleteRoom(hotelId, roomToDelete);
            await fetchHotel();
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
        } catch (err: any) {
            setSubmitError(err.message || 'Error al eliminar habitación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowRoomModal(false);
        setIsEditMode(false);
        setSelectedRoom(null);
        setSubmitError(null);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !hotel) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <ErrorState message={error || 'Hotel no encontrado'} title='No se pudo cargar el hotel'/>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/host')}
                            className="text-secondary hover:text-primary font-medium"
                        >
                            ← Volver a Mis Hoteles
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/host')}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a Mis Hoteles
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-2">{hotel.name}</h1>
                            <p className="text-gray-600">Gestiona las habitaciones de tu hotel</p>
                        </div>
                        <button
                            onClick={() => setShowRoomModal(true)}
                            className="bg-secondary hover:bg-opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Habitación
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Habitaciones</p>
                                <p className="text-3xl font-bold text-primary">{hotel.rooms?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Disponibles</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {hotel.rooms?.filter(r => r.available).length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Precio Mínimo</p>
                                <p className="text-3xl font-bold text-secondary">
                                    ${hotel.min_price || hotel.rooms?.reduce((min, r) =>
                                        r.price_per_night < min ? r.price_per_night : min,
                                        hotel.rooms[0]?.price_per_night || 0
                                    ).toFixed(2)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rooms List */}
                {(!hotel.rooms || hotel.rooms.length === 0) ? (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay habitaciones</h3>
                        <p className="text-gray-600 mb-6">Agrega tu primera habitación para empezar a recibir reservaciones</p>
                        <button
                            onClick={() => setShowRoomModal(true)}
                            className="bg-secondary hover:bg-opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar Primera Habitación
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotel.rooms.map((room) => (
                            <RoomCard
                                key={room.room_id}
                                room={room}
                                onEdit={handleEditRoom}
                                onDelete={handleDeleteRoom}
                            />
                        ))}
                    </div>
                )}

                {/* Room Form Modal */}
                <RoomFormModal
                    isOpen={showRoomModal}
                    isEditMode={isEditMode}
                    room={selectedRoom}
                    onClose={handleCloseModal}
                    onSubmit={isEditMode ? handleUpdateRoom : handleAddRoom}
                    isSubmitting={isSubmitting}
                    error={submitError}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">¿Eliminar habitación?</h3>
                                    <p className="text-gray-600 text-sm">
                                        Esta acción no se puede deshacer. La habitación será eliminada permanentemente.
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
                                        setRoomToDelete(null);
                                        setSubmitError(null);
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteRoom}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
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
            </div>
        </DashboardLayout>
    );
}
