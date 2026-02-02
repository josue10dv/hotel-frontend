import React, { memo } from 'react';
import { Review } from '../../../domain/entities/Hotel';
import { getMediaUrl } from '../../../config/api.config';

interface ReviewCardProps {
    review: Review;
}

// Clases de Tailwind reutilizables
const CARD_STYLES = 'p-4 bg-gray-50 rounded-xl';
const AVATAR_STYLES = 'w-10 h-10 rounded-full object-cover flex-shrink-0';
const STAR_ICON_STYLES = 'w-4 h-4 text-secondary';
const DATE_STYLES = 'text-xs text-gray-500 mb-2';
const COMMENT_STYLES = 'text-sm text-gray-700 line-clamp-3';

/**
 * Componente de tarjeta de reseña individual
 * Muestra información del usuario, calificación, fecha y comentario
 */
export const ReviewCard = memo(function ReviewCard({ review }: ReviewCardProps) {
    // Formatear fecha de forma legible
    const formattedDate = new Date(review.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={CARD_STYLES}>
            <div className="flex items-start gap-3">
                <img
                    src={getMediaUrl(review.user_avatar)}
                    alt={review.user_name}
                    className={AVATAR_STYLES}
                    loading="lazy"
                />
                <div className="flex-1 min-w-0">
                    {/* Header: Nombre y calificación */}
                    <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-app-text truncate">
                            {review.user_name}
                        </h5>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <svg
                                className={STAR_ICON_STYLES}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-app-text">
                                {review.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Fecha */}
                    <p className={DATE_STYLES}>{formattedDate}</p>

                    {/* Comentario */}
                    <p className={COMMENT_STYLES}>{review.comment}</p>
                </div>
            </div>
        </div>
    );
});
