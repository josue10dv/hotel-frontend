import { Hotel } from "../entities/Hotel";
import { HotelRepository } from "../repositories/HotelRepository";

export class GetHotels {
  private hotelRepository: HotelRepository;

  constructor(hotelRepository: HotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  async execute(): Promise<Hotel[]> {
    return this.hotelRepository.getHotels();
  }
}

