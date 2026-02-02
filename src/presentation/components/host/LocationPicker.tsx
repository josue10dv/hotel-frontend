import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export function LocationPicker({ initialLat, initialLng, onLocationSelect }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );

    const handleLocationSelect = useCallback((lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    }, [onLocationSelect]);

    const defaultCenter: [number, number] = position || [-9.1900, -75.0152]; // América Latina

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Ubicación en el Mapa *
                </label>
                {position && (
                    <span className="text-xs text-gray-500">
                        Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
                    </span>
                )}
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                <MapContainer
                    center={defaultCenter}
                    zoom={position ? 13 : 5}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    {position && <Marker position={position} />}
                </MapContainer>
            </div>

            <p className="text-xs text-gray-500 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Haz clic en el mapa para seleccionar la ubicación exacta de tu hotel</span>
            </p>
        </div>
    );
}
