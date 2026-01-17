import { useState, useEffect, useMemo } from "react";
import { InMemoryHotelRepository } from "../../infrastructure/repositories/InMemoryHotelRepository";
import { GetHotels } from "../../domain/usecases/GetHotels";
import { SearchHotels } from "../../domain/usecases/SearchHotels";
import { FilterHotelsByCategory } from "../../domain/usecases/FilterHotelsByCategory";
import { Hotel } from "../../domain/entities/Hotel";

const repository = new InMemoryHotelRepository();
const getHotelsUseCase = new GetHotels(repository);
const searchHotelsUseCase = new SearchHotels();
const filterHotelsByCategoryUseCase = new FilterHotelsByCategory();

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  useEffect(() => {
    getHotelsUseCase.execute().then((data) => {
      setHotels(data);
      setLoading(false);
    });
  }, []);

  const filteredHotels = useMemo(() => {
    let result = hotels;
    result = searchHotelsUseCase.execute(result, searchQuery);
    result = filterHotelsByCategoryUseCase.execute(result, selectedCategory);
    return result;
  }, [hotels, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const allCategories = hotels.map((h) => h.category);
    return ["All", ...Array.from(new Set(allCategories))];
  }, [hotels]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedHotelId(null); // Deselect on filter change to avoid confusion
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedHotelId(null);
  };

  const handleHotelSelect = (id: string) => {
    setSelectedHotelId(id);
  };

  const selectedHotel = useMemo(
    () => hotels.find((h) => h.id === selectedHotelId) || null,
    [hotels, selectedHotelId]
  );

  return {
    hotels: filteredHotels,
    loading,
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

