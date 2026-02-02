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
                
                // Si hay búsqueda, usar endpoint de búsqueda
                if (searchQuery.trim()) {
                    const data = await hotelService.getRepository().searchHotels({
                        q: searchQuery,
                    });
                    setHotels(data);
                } else {
                    // De lo contrario, obtener todos los hoteles
                    const data = await hotelService.getHotelsUseCase.execute();
                    setHotels(data);
                }
            } catch (err: any) {
                setError(err.message || 'Error al cargar los hoteles');
                console.error('Error cargando hoteles:', err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce para búsqueda
        const timeoutId = setTimeout(() => {
            fetchHotels();
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const categories = useMemo(() => {
        if (hotels.length === 0) return ["All"];
        const uniqueCategories = new Set(
            hotels.map((h) => h.category).filter((c): c is string => c !== undefined)
        );
        return ["All", ...Array.from(uniqueCategories)];
    }, [hotels]);

    // Aplicar solo el filtro de categoría localmente (la búsqueda ya se hace en el backend)
    const filteredHotels = useMemo(() => {
        if (selectedCategory && selectedCategory !== "All") {
            return hotelService.filterHotelsByCategoryUseCase.execute(hotels, selectedCategory);
        }
        return hotels;
    }, [hotels, selectedCategory]);

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
        categories: categories as string[],
        searchQuery,
        selectedCategory,
        selectedHotelId,
        selectedHotel,
        handleSearch,
        handleCategorySelect,
        handleHotelSelect,
    };
}

