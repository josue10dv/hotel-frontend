import { Hotel } from "../../domain/entities/Hotel";
import { HotelRepository } from "../../domain/repositories/HotelRepository";
import { INITIAL_HOTELS } from "../data/hotels.mock";

export class InMemoryHotelRepository implements HotelRepository {
  async getHotels(): Promise<Hotel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...INITIAL_HOTELS]);
      }, 100);
    });
  }

  async getHotelById(id: string): Promise<Hotel | undefined> {
    return new Promise((resolve) => {
        setTimeout(() => {
          const hotel = INITIAL_HOTELS.find(h => h.id === id);
          resolve(hotel ? { ...hotel } : undefined);
        }, 100);
    });
  }
}
