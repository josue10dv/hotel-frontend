import React, { memo } from 'react';
import { Location } from '../../../domain/entities/Hotel';

interface GoogleMapProps {
    location: Location;
    hotelName: string;
    address: string;
}

const SECTION_STYLES = 'bg-white p-6 rounded-2xl border border-gray-200';
const MAP_CONTAINER_STYLES = 'w-full h-[400px] rounded-xl overflow-hidden';

/**
 * Componente de mapa de Google Maps
 * Muestra la ubicación del hotel en un iframe embebido de Google Maps
 */
export const GoogleMap = memo(function GoogleMap({
    location,
    hotelName,
    address
}: GoogleMapProps) {
    // URL alternativa sin API key (usando query search)
    const url = `https://maps.google.com/maps?q=${location.lat},${location.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <section className={SECTION_STYLES}>
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-primary mb-2">
                    Ubicación
                </h3>
                <p className="text-sm text-gray-600">{address}</p>
            </div>

            {/* Mapa embebido */}
            <div className={MAP_CONTAINER_STYLES}>
                <iframe
                    src={url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ubicación de ${hotelName}`}
                    aria-label={`Mapa mostrando la ubicación de ${hotelName} en ${address}`}
                />
            </div>

            {/* Enlace para abrir en Google Maps */}
            <div className="mt-4 text-center">
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    Ver en Google Maps
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            </div>
        </section>
    );
});
