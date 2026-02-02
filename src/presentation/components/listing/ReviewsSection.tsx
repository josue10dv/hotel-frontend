import { memo } from 'react';
import { ReviewCard } from './ReviewCard';
import { Review } from '../../../domain/entities/Hotel';

interface ReviewsSectionProps {
    reviews: Review[];
    showAll: boolean;
    onToggleShowAll: () => void;
}

const REVIEWS_LIMIT = 6;
const SECTION_STYLES = 'bg-white p-6 rounded-2xl border border-gray-200';
const GRID_STYLES = 'grid grid-cols-1 md:grid-cols-2 gap-4';
const BUTTON_STYLES = 'px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all';

/**
 * Sección de reseñas de hotel
 * Muestra las reseñas en grid con opción de expandir/colapsar
 */
export const ReviewsSection = memo(function ReviewsSection({
    reviews,
    showAll,
    onToggleShowAll
}: ReviewsSectionProps) {
    const hasMoreReviews = reviews.length > REVIEWS_LIMIT;
    const displayedReviews = showAll ? reviews : reviews.slice(0, REVIEWS_LIMIT);
    const remainingCount = reviews.length - REVIEWS_LIMIT;

    return (
        <section className={SECTION_STYLES}>
            {/* Header */}
            <h3 className="text-xl font-bold text-primary mb-6">
                Reseñas ({reviews.length})
            </h3>

            {/* Estado vacío */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>Aún no hay reseñas para este alojamiento.</p>
                    <p className="text-sm mt-2">¡Sé el primero en dejar una reseña!</p>
                </div>
            ) : (
                <>
                    {/* Grid de reseñas */}
                    <div className={GRID_STYLES}>
                        {displayedReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>

                    {/* Botón mostrar más/menos */}
                    {hasMoreReviews && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={onToggleShowAll}
                                className={BUTTON_STYLES}
                                aria-expanded={showAll}
                            >
                                {showAll 
                                    ? 'Mostrar menos' 
                                    : `Mostrar más reseñas (${remainingCount} más)`
                                }
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
});
