import { memo } from "react";
import { Hotel } from "../../domain/entities/Hotel";

interface MapPanelProps {
  selectedHotel: Hotel | null;
}

const MapPanel = memo(function MapPanel({ selectedHotel }: MapPanelProps) {
  return (
        <div className="top-4 h-[calc(100vh-140px)] w-full bg-gray-200 rounded-3xl overflow-hidden border border-gray-300 shadow-inner group relative">
            <div className="absolute inset-0 bg-[url('https://api.placeholder.com/map')] opacity-20 bg-cover bg-center grayscale" />
            <div className="absolute inset-0 bg-gray-200 opacity-50" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="absolute inset-0 flex items-center justify-center p-8">
                {selectedHotel ? (
                    <div className="flex flex-col items-center animate-bounce-short">
                        <div className="relative">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg border-4 border-white transform -translate-y-1/2">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 blur-sm rounded-full" />
                        </div>

                        <div className="mt-4 bg-white px-6 py-4 rounded-xl shadow-xl border border-gray-100 max-w-sm text-center">
                            <h3 className="font-bold text-app-text text-lg mb-1">{selectedHotel.name}</h3>
                            <p className="text-gray-500 text-sm mb-2">{selectedHotel.city}, {selectedHotel.country}</p>
                            <div className="flex justify-center items-center gap-1 text-primary bg-secondary px-3 py-1 rounded-full text-xs font-bold w-fit mx-auto">
                                <span className="text-base">${selectedHotel.pricePerNight}</span>
                                <span className="font-medium">/ night</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="font-medium">Select a hotel to view on map</p>
                    </div>
                )}
            </div>

            {/* Map UI Controls Placeholder */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer">+</div>
                <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer">-</div>
            </div>
        </div>
    );
});

export default MapPanel;
