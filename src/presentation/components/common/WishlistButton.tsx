import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { wishlistService } from '../../../infrastructure/services/WishlistService';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
    hotelId: string;
    className?: string;
    showLabel?: boolean;
}

export function WishlistButton({ hotelId, className = '', showLabel = false }: WishlistButtonProps) {
    const { user } = useAuthContext();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkFavoriteStatus();
        }
    }, [hotelId, user]);

    const checkFavoriteStatus = async () => {
        try {
            const result = await wishlistService.getRepository().checkIsFavorite(hotelId);
            setIsFavorite(result.is_favorite);
        } catch (error) {
            console.error('Error al verificar favorito:', error);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Debes iniciar sesión para agregar favoritos');
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                await wishlistService.getRepository().removeFromWishlist(hotelId);
                setIsFavorite(false);
            } else {
                await wishlistService.getRepository().addToWishlist({ hotel_id: hotelId });
                setIsFavorite(true);
            }
        } catch (error: any) {
            console.error('Error al actualizar favoritos:', error);
            alert(error.message || 'Error al actualizar favoritos');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-sm ${isFavorite
                    ? 'text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                } disabled:opacity-50 ${className}`}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
            <Heart
                className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''
                    }`}
            />
            {showLabel && (
                <span className="text-sm font-medium ml-2">
                    {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                </span>
            )}
        </button>
    );
}
