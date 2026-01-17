import { Hotel } from "../entities/Hotel";

export class FilterHotelsByCategory {
  execute(hotels: Hotel[], category: string): Hotel[] {
    if (!category || category === "All") return hotels;
    return hotels.filter((hotel) => hotel.category === category);
  }
}

