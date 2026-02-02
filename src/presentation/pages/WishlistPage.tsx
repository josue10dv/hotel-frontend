import { useState, useEffect } from 'react';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { wishlistService } from '../../infrastructure/services/WishlistService';
import { Wishlist, WishlistHotel } from '../../domain/entities/Wishlist';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { getMediaUrl } from '../../config/api.config';

export function WishlistPage() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            const data = await wishlistService.getRepository().getWishlist();
            setWishlist(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (hotelId: string) => {
        if (!window.confirm('¿Estás seguro de quitar este hotel de tus favoritos?')) {
            return;
        }

        try {
            await wishlistService.getRepository().removeFromWishlist(hotelId);
            // Actualizar la lista localmente
            if (wishlist) {
                setWishlist({
                    ...wishlist,
                    hotels: wishlist.hotels.filter(h => h.id !== hotelId),
                });
            }
        } catch (error: any) {
            alert(error.message || 'Error al eliminar el hotel');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('¿Estás seguro de limpiar toda tu lista de favoritos?')) {
            return;
        }

        try {
            await wishlistService.getRepository().clearWishlist();
            setWishlist({ user_id: wishlist?.user_id || '', hotels: [] });
        } catch (error: any) {
            alert(error.message || 'Error al limpiar la lista');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ErrorState title="Error al cargar favoritos" message={error} />
            </div>
        );
    }

    const hotels = wishlist?.hotels || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                {/* Botón de regresar */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Volver al inicio</span>
                </button>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
                            <p className="text-gray-600 mt-1">
                                {hotels.length} {hotels.length === 1 ? 'hotel guardado' : 'hoteles guardados'}
                            </p>
                        </div>
                    </div>
                    {hotels.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {hotels.length === 0 ? (
                <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes hoteles favoritos
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Explora hoteles y agrega tus favoritos haciendo clic en el ícono de corazón
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Explorar Hoteles
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                        <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onRemove={handleRemove}
                            onClick={() => navigate(`/listing/${hotel.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface HotelCardProps {
    hotel: WishlistHotel;
    onRemove: (hotelId: string) => void;
    onClick: () => void;
}

function HotelCard({ hotel, onRemove, onClick }: HotelCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative h-48">
                <img
                    src={getMediaUrl(hotel.images[0] || '/placeholder-hotel.jpg')}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(hotel.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                    title="Quitar de favoritos"
                >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {hotel.name}
                    </h3>
                    {hotel.rating && (
                        <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                            ★ {hotel.rating.toFixed(1)}
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {hotel.address.city}, {hotel.address.country}
                </p>

                {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                                {amenity}
                            </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{hotel.amenities.length - 3} más
                            </span>
                        )}
                    </div>
                )}

                {hotel.total_reviews && hotel.total_reviews > 0 && (
                    <p className="text-sm text-gray-500">
                        {hotel.total_reviews} {hotel.total_reviews === 1 ? 'reseña' : 'reseñas'}
                    </p>
                )}
            </div>
        </div>
    );
}
