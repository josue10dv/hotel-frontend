import { memo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hotel } from "../../domain/entities/Hotel";
import { getMediaUrl } from "../../config/api.config";

// Fix para los iconos de Leaflet en Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icono personalizado para hotel seleccionado
const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Icono por defecto para hoteles no seleccionados
const defaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapPanelProps {
    selectedHotel: Hotel | null;
    hotels: Hotel[];
    onHotelSelect?: (id: string) => void;
}

// Componente para ajustar la vista del mapa
function MapViewUpdater({ hotels, selectedHotel }: { hotels: Hotel[], selectedHotel: Hotel | null }) {
    const map = useMap();
    const prevHotelsRef = useRef<Hotel[]>([]);

    useEffect(() => {
        if (selectedHotel && selectedHotel.location) {
            // Centrar en hotel seleccionado
            map.setView([selectedHotel.location.lat, selectedHotel.location.lng], 14, {
                animate: true
            });
        } else if (hotels.length > 0 && JSON.stringify(hotels) !== JSON.stringify(prevHotelsRef.current)) {
            // Ajustar vista para mostrar todos los hoteles
            const validLocations = hotels.filter(h => h.location && h.location.lat && h.location.lng);
            if (validLocations.length > 0) {
                const bounds = L.latLngBounds(
                    validLocations.map(h => [h.location!.lat, h.location!.lng])
                );
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
            }
            prevHotelsRef.current = hotels;
        }
    }, [hotels, selectedHotel, map]);

    return null;
}

const MapPanel = memo(function MapPanel({ selectedHotel, hotels, onHotelSelect }: MapPanelProps) {
    // Centro por defecto: América Latina
    const defaultCenter: [number, number] = [-9.1900, -75.0152];
    const defaultZoom = 5;

    // Filtrar hoteles con ubicación válida
    const hotelsWithLocation = hotels.filter(
        h => h.location && h.location.lat && h.location.lng
    );

    if (hotelsWithLocation.length === 0) {
        return (
            <div className="h-full w-full bg-gray-200 rounded-3xl overflow-hidden border border-gray-300 shadow-inner flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <p className="font-medium">No hay hoteles con ubicación disponible</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-3xl overflow-hidden border border-gray-300 shadow-lg">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapViewUpdater hotels={hotelsWithLocation} selectedHotel={selectedHotel} />

                {hotelsWithLocation.map((hotel) => (
                    <Marker
                        key={hotel.id}
                        position={[hotel.location!.lat, hotel.location!.lng]}
                        icon={selectedHotel?.id === hotel.id ? selectedIcon : defaultIcon}
                        eventHandlers={{
                            click: () => {
                                if (onHotelSelect) {
                                    onHotelSelect(hotel.id);
                                }
                            },
                        }}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                {hotel.images && hotel.images[0] && (
                                    <img
                                        src={getMediaUrl(hotel.images[0])}
                                        alt={hotel.name}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <h3 className="font-bold text-app-text text-base mb-1">
                                    {hotel.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-2">
                                    {hotel.address.city}, {hotel.address.country}
                                </p>
                                {hotel.rating && (
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-semibold text-sm">{hotel.rating.toFixed(2)}</span>
                                        {hotel.total_reviews && (
                                            <span className="text-gray-400 text-xs">({hotel.total_reviews} reviews)</span>
                                        )}
                                    </div>
                                )}
                                {hotel.min_price && (
                                    <div className="flex items-center gap-1 text-primary font-bold">
                                        <span className="text-lg">${hotel.min_price}</span>
                                        <span className="font-medium text-sm text-gray-600">/ noche</span>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
});

export default MapPanel;
