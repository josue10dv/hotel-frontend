import { Hotel } from "../entities/Hotel";

export class SearchHotels {
  execute(hotels: Hotel[], query: string): Hotel[] {
    if (!query) return hotels;
    const lowerQuery = query.toLowerCase();
    return hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lowerQuery) ||
        hotel.city.toLowerCase().includes(lowerQuery)
    );
  }
}

