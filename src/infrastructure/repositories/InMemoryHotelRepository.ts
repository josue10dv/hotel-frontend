import { Hotel } from "../../domain/entities/Hotel";
import { HotelRepository } from "../../domain/repositories/HotelRepository";
import { INITIAL_HOTELS } from "../data/hotels.mock";

export class InMemoryHotelRepository implements HotelRepository {
  async getHotels(): Promise<Hotel[]> {
    // Simulate API latency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...INITIAL_HOTELS]);
      }, 500);
    });
  }
}
