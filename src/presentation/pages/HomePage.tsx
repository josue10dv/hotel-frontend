import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryChips from "../components/CategoryChips";
import HotelGrid from "../components/HotelGrid";
import MapPanel from "../components/MapPanel";
import { useHotels } from "../hooks/useHotels";

export default function HomePage() {
    const {
        hotels,
        loading,
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
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <main className="pt-24 pb-8 px-8 max-w-[1600px] mx-auto">
                {/* Top Section: Search & Filters */}
                <div className="flex flex-col items-center gap-6 mb-10">
                    <SearchBar value={searchQuery} onChange={handleSearch} />

                    <CategoryChips
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategorySelect}
                    />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-12 gap-8 items-start">

                    {/* Left Column: Hotel List (Scrollable) */}
                    <div className="col-span-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h2 className="text-xl font-bold text-gray-800">
                                {loading ? 'Searching...' : `${hotels.length} places to stay`}
                            </h2>
                        </div>

                        {loading ? (
                            // Skeleton Loading
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

                    {/* Right Column: Map (Sticky) */}
                    <div className="col-span-7 sticky top-24 h-[calc(100vh-8rem)]">
                        <MapPanel selectedHotel={selectedHotel} />
                    </div>

                </div>
            </main>
        </div>
    );
}
