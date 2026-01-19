import { Hotel } from "../entities/Hotel";

export interface HotelRepository {
  getHotels(): Promise<Hotel[]>;
  getHotelById(id: string): Promise<Hotel | undefined>;
}


