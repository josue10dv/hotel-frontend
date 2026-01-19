import React from "react";
import SearchBar from "../components/SearchBar";

import CategoryChips from "../components/CategoryChips";
import HotelGrid from "../components/HotelGrid";
import MapPanel from "../components/MapPanel";
import { useHotels } from "../hooks/useHotels";

export default function HomePage() {
    const {
        hotels,
        loading,
        error,
        categories,
        searchQuery,
        selectedCategory,
        selectedHotelId,
        selectedHotel,
        handleSearch,
        handleCategorySelect,
        handleHotelSelect,
    } = useHotels();

    return (
        <div className="min-h-screen bg-app-background font-sans">
            <main className="pt-24 pb-8 px-8 max-w-[1600px] mx-auto">

                <div className="flex flex-col items-center gap-6 mb-10">
                    <SearchBar value={searchQuery} onChange={handleSearch} />

                    <CategoryChips
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategorySelect}
                    />
                </div>

                <div className="grid grid-cols-12 gap-8 items-start">

                    <div className="col-span-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h2 className="text-xl font-bold text-app-text">
                                {loading ? 'Buscando...' : `${hotels.length} lugares para hospedarse`}
                            </h2>
                        </div>

                        {error ? (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar hoteles</h3>
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <HotelGrid
                                hotels={hotels}
                                selectedHotelId={selectedHotelId}
                                onHotelSelect={handleHotelSelect}
                            />
                        )}
                    </div>

                    <div className="col-span-7 sticky top-24 h-[calc(100vh-8rem)]">
                        <MapPanel selectedHotel={selectedHotel} />
                    </div>

                </div>
            </main>
        </div>
    );
}
