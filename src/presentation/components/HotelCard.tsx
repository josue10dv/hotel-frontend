import { Hotel } from "../../domain/entities/Hotel";

interface HotelCardProps {
  hotel: Hotel;
  isSelected: boolean;
  onClick: () => void;
}

export default function HotelCard({ hotel, isSelected, onClick }: HotelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
        ${
          isSelected
            ? "ring-2 ring-blue-500 shadow-xl scale-[1.02]"
            : "border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
        }
      `}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {hotel.city}, {hotel.country}
                    </p>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span
                            key={amenity}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium"
                        >
                            {amenity}
                        </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-50 text-gray-400 rounded-md">+{(hotel.amenities.length - 3)}</span>
                    )}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">${hotel.pricePerNight}</span>
                            <span className="text-sm text-gray-500">/night</span>
                        </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                        {isSelected ? 'Selected' : 'View Details'}
                    </button>
                </div>
            </div>
        </div>
    );
}
