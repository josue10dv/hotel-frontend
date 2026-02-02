import React, { memo } from 'react';

interface RatingBannerProps {
    rating: number;
    reviewCount: number;
    title?: string;
    subtitle?: string;
    variant?: 'compact' | 'full';
}

export const RatingBanner = memo(function RatingBanner({
    rating,
    reviewCount,
    title = "Mejor calificado",
    subtitle = "Uno de los hogares más queridos",
    variant = 'compact'
}: RatingBannerProps) {
    const renderStars = () => (
        <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className="w-4 h-4 text-app-text"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    const renderStarIcon = () => (
        <svg
            className="w-8 h-8 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    );

    if (variant === 'full') {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                    {/* Title and Subtitle - Full Width */}
                    <div className="flex items-center gap-3 justify-center">
                        {renderStarIcon()}
                        <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-app-text">
                                {title}
                            </div>
                            <p className="text-base text-gray-600 mt-1">{subtitle}</p>
                        </div>
                        {renderStarIcon()}
                    </div>

                    {/* Rating and Reviews - Centered Below */}
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-app-text">
                                {rating.toFixed(2)}
                            </div>
                            {renderStars()}
                        </div>
                        <div className="h-16 w-px bg-gray-300"></div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-app-text">
                                {reviewCount}
                            </div>
                            <div className="text-base text-gray-600 mt-1">
                                {reviewCount === 1 ? 'Reseña' : 'Reseñas'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Compact variant
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col gap-3">
                {/* Title and Subtitle - Full Width */}
                <div className="flex items-center gap-2 justify-center">
                    {renderStarIcon()}
                    <div className="text-center">
                        <div className="text-xl font-bold text-app-text">
                            {title}
                        </div>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                    {renderStarIcon()}
                </div>

                {/* Rating and Reviews - Centered Below */}
                <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-app-text">
                            {rating.toFixed(2)}
                        </div>
                        {renderStars()}
                    </div>
                    <div className="h-12 w-px bg-gray-300"></div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-app-text">
                            {reviewCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {reviewCount === 1 ? 'Reseña' : 'Reseñas'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
