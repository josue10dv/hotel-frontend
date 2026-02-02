import React, { memo } from 'react';
import { Review } from '../../../domain/entities/Hotel';
import { getMediaUrl } from '../../../config/api.config';

interface ReviewGridProps {
  reviews: Review[];
  rating: number;
}

export const ReviewGrid = memo(function ReviewGrid({ reviews, rating }: ReviewGridProps) {
  return (
    <div className="py-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            {/* Large Avatar */}
            <div className="flex-shrink-0">
              <img
                src={getMediaUrl(review.user_avatar)}
                alt={review.user_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-lg text-gray-900">{review.user_name}</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

