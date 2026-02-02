import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageGallery } from '../components/listing/ImageGallery';
import { BookingWidget } from '../components/listing/BookingWidget';
import { RatingBanner } from '../components/listing/RatingBanner';
import { ReviewsSection } from '../components/listing/ReviewsSection';
import { GoogleMap } from '../components/listing/GoogleMap';
import { MainLayout } from '../components/layouts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { InfoCard } from '../components/common/InfoCard';
import { useHotelDetails } from '../hooks/useHotelDetails';
import { useAuthContext } from '../context/AuthContext';

// Clases de Tailwind constantes para consistencia
const CONTAINER_STYLES = 'container mx-auto px-4 py-8 max-w-[1400px]';
const GRID_MAIN_STYLES = 'grid grid-cols-1 lg:grid-cols-3 gap-8';
const GRID_INFO_STYLES = 'grid grid-cols-1 md:grid-cols-2 gap-6';
const SECTION_SPACING = 'space-y-8';
const STICKY_SIDEBAR_STYLES = 'sticky top-24 space-y-4';
const AMENITY_ITEM_STYLES = 'flex items-center gap-2 text-app-text';
const POLICY_ITEM_STYLES = 'space-y-4';

/**
 * Página de detalles y reservación de hotel
 * Muestra información completa del hotel, galería, políticas y reseñas
 * Incluye widget de reservación en sidebar sticky
 */
export const ReservationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { hotel, loading, error, showAllReviews, toggleShowAllReviews } = useHotelDetails(id);

    // Protección de ruta: redirigir a login si no hay sesión activa
    useEffect(() => {
        if (!user) {
            // Guardar la URL actual para redirigir después del login
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    // Estado de carga
    if (loading) {
        return (
            <MainLayout>
                <LoadingSpinner message="Cargando detalles del hotel..." />
            </MainLayout>
        );
    }

    // Estado de error o sin datos
    if (!hotel) {
        return (
            <MainLayout>
                <ErrorState
                    title={error ? 'Error al cargar hotel' : 'Hotel no encontrado'}
                    message={error || undefined}
                />
            </MainLayout>
        );
    }

    // Preparar items del breadcrumb
    const breadcrumbItems = [
        { label: 'Inicio', path: '/' },
        { label: hotel.name }
    ];

    return (
        <MainLayout>
            <div className={CONTAINER_STYLES}>
                {/* Navegación breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Header del hotel */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        {hotel.name}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {hotel.address.city}, {hotel.address.state}, {hotel.address.country}
                    </p>
                </header>

                {/* Grid principal: Contenido y Sidebar */}
                <div className={GRID_MAIN_STYLES}>
                    {/* Columna principal: Contenido */}
                    <div className={`lg:col-span-2 ${SECTION_SPACING}`}>
                        {/* Galería de imágenes */}
                        <section className="rounded-2xl overflow-hidden">
                            <ImageGallery images={hotel.images} />
                        </section>

                        {/* Grid de información: Descripción/Comodidades | Políticas */}
                        <div className={GRID_INFO_STYLES}>
                            {/* Descripción y Comodidades */}
                            <InfoCard title="" className="space-y-6">
                                {/* Descripción */}
                                <div>
                                    <h3 className="text-xl font-bold text-primary mb-4">
                                        Sobre este alojamiento
                                    </h3>
                                    <p className="text-app-text leading-relaxed">
                                        {hotel.description}
                                    </p>
                                </div>

                                {/* Comodidades */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-xl font-bold text-primary mb-4">
                                        Comodidades
                                    </h3>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {hotel.amenities.map((amenity, index) => (
                                            <li key={index} className={AMENITY_ITEM_STYLES}>
                                                <svg
                                                    className="w-5 h-5 text-secondary flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span>{amenity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </InfoCard>

                            {/* Políticas */}
                            <InfoCard title="Políticas">
                                <div className={POLICY_ITEM_STYLES}>
                                    <PolicyItem
                                        title="Check-in"
                                        value={hotel.policies.check_in_time}
                                    />
                                    <PolicyItem
                                        title="Check-out"
                                        value={hotel.policies.check_out_time}
                                    />
                                    <PolicyItem
                                        title="Política de cancelación"
                                        value={hotel.policies.cancellation_policy}
                                    />
                                    <PolicyItem
                                        title="Política de mascotas"
                                        value={hotel.policies.pet_policy}
                                    />
                                </div>
                            </InfoCard>
                        </div>

                        {/* Sección de reseñas */}
                        <ReviewsSection
                            reviews={hotel.reviews || []}
                            showAll={showAllReviews}
                            onToggleShowAll={toggleShowAllReviews}
                        />

                        {/* Sección de mapa - Ubicación */}
                        {hotel.location && (
                            <GoogleMap
                                location={hotel.location}
                                hotelName={hotel.name}
                                address={`${hotel.address.street}, ${hotel.address.city}, ${hotel.address.state}, ${hotel.address.country}`}
                            />
                        )}
                    </div>

                    {/* Sidebar: Widget de reservación y rating */}
                    <aside className="lg:col-span-1">
                        <div className={STICKY_SIDEBAR_STYLES}>
                            <RatingBanner
                                rating={hotel.rating}
                                reviewCount={hotel.reviews?.length || 0}
                                title={hotel.ratingInfo?.title}
                                subtitle={hotel.ratingInfo?.subtitle}
                                variant="compact"
                            />
                            <BookingWidget 
                                hotelId={hotel.id}
                                roomId={hotel.rooms?.[0]?.room_id || 'default-room'}
                                pricePerNight={hotel.min_price || 100}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
};

/**
 * Componente auxiliar para items de política
 * Muestra título y valor de forma consistente
 */
const PolicyItem: React.FC<{ title: string; value: string }> = ({ title, value }) => (
    <div>
        <h4 className="font-semibold text-app-text mb-1">{title}</h4>
        <p className="text-gray-600">{value}</p>
    </div>
);

