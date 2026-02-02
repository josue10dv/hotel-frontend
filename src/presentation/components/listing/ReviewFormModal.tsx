import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { CreateReviewData } from '../../../domain/entities/Review';
import { reviewService } from '../../../infrastructure/services/ReviewService';

interface ReviewFormModalProps {
    hotelId: string;
    hotelName: string;
    reservationId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function ReviewFormModal({ hotelId, hotelName, reservationId, onClose, onSuccess }: ReviewFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<{
        title?: string;
        comment: string;
        stay_date?: string;
        ratings: {
            overall: number;
            cleanliness: number;
            location: number;
            service: number;
            value: number;
        };
    }>({
        title: '',
        comment: '',
        stay_date: '',
        ratings: {
            overall: 5,
            cleanliness: 5,
            location: 5,
            service: 5,
            value: 5,
        },
    });

    const handleRatingChange = (category: keyof typeof formData.ratings, value: number) => {
        setFormData(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings,
                [category]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.comment.trim()) {
            alert('Por favor escribe un comentario');
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData: CreateReviewData = {
                hotel_id: hotelId,
                reservation_id: reservationId,
                rating_breakdown: formData.ratings,
                comment: formData.comment,
                title: formData.title,
                stay_date: formData.stay_date,
            };

            await reviewService.getRepository().createReview(reviewData);
            alert('¡Reseña enviada exitosamente! Está pendiente de aprobación.');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || 'Error al enviar la reseña');
        } finally {
            setIsSubmitting(false);
        }
    };

    const RatingSelector = ({ label, category, value }: { label: string; category: keyof typeof formData.ratings; value: number }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingChange(category, rating)}
                        className={`p-2 transition-colors ${rating <= value ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-500`}
                    >
                        <Star className="w-6 h-6 fill-current" />
                    </button>
                ))}
                <span className="ml-2 text-gray-600">{value}.0</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Escribe tu reseña</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{hotelName}</h3>
                        <p className="text-gray-600 text-sm">Comparte tu experiencia para ayudar a otros viajeros</p>
                    </div>

                    {/* Ratings */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Calificaciones</h4>
                        <RatingSelector label="Calificación General" category="overall" value={formData.ratings.overall} />
                        <RatingSelector label="Limpieza" category="cleanliness" value={formData.ratings.cleanliness} />
                        <RatingSelector label="Ubicación" category="location" value={formData.ratings.location} />
                        <RatingSelector label="Servicio" category="service" value={formData.ratings.service} />
                        <RatingSelector label="Relación calidad-precio" category="value" value={formData.ratings.value} />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título (opcional)</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Resume tu experiencia"
                        />
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentario *</label>
                        <textarea
                            value={formData.comment}
                            onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                            rows={5}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Cuéntanos sobre tu estadía..."
                        />
                    </div>

                    {/* Stay Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de estadía (opcional)</label>
                        <input
                            type="date"
                            value={formData.stay_date}
                            onChange={e => setFormData(prev => ({ ...prev, stay_date: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
