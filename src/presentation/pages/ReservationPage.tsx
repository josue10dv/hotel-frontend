import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Hotel } from '../../domain/entities/Hotel';
import { hotelService } from '../../infrastructure/services/HotelService';
import { ImageGallery } from '../components/listing/ImageGallery';
import { BookingWidget } from '../components/listing/BookingWidget';
import { ReviewGrid } from '../components/listing/ReviewGrid';

export const ReservationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchHotel = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await hotelService.getHotelByIdUseCase.execute(id);
                    setHotel(data);
                } catch (err: any) {
                    setError(err.message || 'Error al cargar el hotel');
                    console.error('Error cargando hotel:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchHotel();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="container mx-auto px-4 py-8 text-center pt-24">
                {error ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar hotel</h1>
                        <p className="text-red-600 mb-4">{error}</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel no encontrado</h1>
                    </>
                )}
                <Link to="/" className="text-primary hover:underline mt-4 block">Volver al Inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-8 pt-24 max-w-[1400px]">
                
                 <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="rounded-3xl overflow-hidden h-fit">
                        <ImageGallery images={hotel.gallery || [hotel.imageUrl]} />
                    </div>

                    <div className="flex flex-col gap-6">
                         
                         <div className="flex items-center gap-4">
                            <img
                                src={hotel.host?.avatar || "https://i.pravatar.cc/150?u=default"}
                                alt={hotel.host?.name}
                                className="w-16 h-16 rounded-full object-cover shadow-sm"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{hotel.host?.name || "Anfitrion"}</h2>
                                <p className="text-gray-500 text-sm">Anfitrión</p>
                            </div>
                        </div>

                        <div className="bg-[#4b5563] text-white p-6 rounded-3xl shadow-lg flex flex-col justify-center">
                            <div className="text-3xl font-bold mb-1 flex items-center gap-2">
                                <span>★ {hotel.rating}</span>
                            </div>
                             <div className="text-gray-300 text-sm">{hotel.reviews?.length || 0} reseñas</div>
                        </div>

                        <div>
                             <h3 className="font-bold text-gray-900 mb-2">Sobre este alojamiento</h3>
                             <p className="text-gray-600 leading-relaxed text-sm">
                                {hotel.description || "Descripción no disponible."}
                             </p>
                        </div>

                        <BookingWidget pricePerNight={hotel.pricePerNight} />

                    </div>
                </div>

                 <div className="mt-16">
                     <ReviewGrid reviews={hotel.reviews || []} rating={hotel.rating} />
                 </div>
            </main>
        </div>
    );
};

