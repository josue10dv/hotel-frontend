import { useState, useEffect, useMemo } from "react";
import { hotelService } from "../../infrastructure/services/HotelService";
import { Hotel } from "../../domain/entities/Hotel";

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotelService.getHotelsUseCase.execute();
        setHotels(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los hoteles');
        console.error('Error cargando hoteles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const categories = useMemo(() => {
    if (hotels.length === 0) return ["All"];
    const uniqueCategories = new Set(hotels.map((h) => h.category));
    return ["All", ...Array.from(uniqueCategories)];
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    let result = hotels;
    if (searchQuery) {
      result = hotelService.searchHotelsUseCase.execute(result, searchQuery);
    }
    if (selectedCategory && selectedCategory !== "All") {
      result = hotelService.filterHotelsByCategoryUseCase.execute(result, selectedCategory);
    }
    return result;
  }, [hotels, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedHotelId(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedHotelId(null);
  };

  const handleHotelSelect = (id: string) => {
    setSelectedHotelId(id);
  };

  const selectedHotel = useMemo(
    () => selectedHotelId ? hotels.find((h) => h.id === selectedHotelId) || null : null,
    [hotels, selectedHotelId]
  );

  return {
    hotels: filteredHotels,
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
  };
}

