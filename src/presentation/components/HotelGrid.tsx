import HotelCard from "./HotelCard";
import { Hotel } from "../../domain/entities/Hotel";

interface HotelGridProps {
  hotels: Hotel[];
  selectedHotelId: string | null;
  onHotelSelect: (id: string) => void;
}

export default function HotelGrid({ hotels, selectedHotelId, onHotelSelect }: HotelGridProps) {
  if (hotels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No hotels found</h3>
                <p className="text-gray-500 mt-1">
                    Try adjusting your search or filters
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-6 p-1">
            {hotels.map((hotel) => (
                <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    isSelected={selectedHotelId === hotel.id}
                    onClick={() => onHotelSelect(hotel.id)}
                />
            ))}
        </div>
    );
}
