import { Hotel } from "../entities/Hotel";
import { HotelRepository } from "../repositories/HotelRepository";

export class GetHotelById {
  constructor(private hotelRepository: HotelRepository) {}

  async execute(id: string): Promise<Hotel | undefined> {
    return this.hotelRepository.getHotelById(id);
  }
}
