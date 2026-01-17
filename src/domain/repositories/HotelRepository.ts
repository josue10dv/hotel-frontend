import { Hotel } from "../entities/Hotel";

export interface HotelRepository {
  getHotels(): Promise<Hotel[]>;
}

