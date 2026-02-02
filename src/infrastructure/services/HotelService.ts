import { HttpHotelRepository } from "../repositories/HttpHotelRepository";
import { HotelRepository } from "../../domain/repositories/HotelRepository";
import { GetHotels } from "../../domain/usecases/GetHotels";
import { GetHotelById } from "../../domain/usecases/GetHotelById";
import { SearchHotels } from "../../domain/usecases/SearchHotels";
import { FilterHotelsByCategory } from "../../domain/usecases/FilterHotelsByCategory";
import { CreateHotel } from "../../domain/usecases/CreateHotel";

class HotelService {
  private static instance: HotelService;
  private repository: HotelRepository;

  public getHotelsUseCase: GetHotels;
  public getHotelByIdUseCase: GetHotelById;
  public createHotelUseCase: CreateHotel;
  public searchHotelsUseCase = new SearchHotels();
  public filterHotelsByCategoryUseCase = new FilterHotelsByCategory();

  private constructor() {
    this.repository = new HttpHotelRepository();
    this.getHotelsUseCase = new GetHotels(this.repository);
    this.getHotelByIdUseCase = new GetHotelById(this.repository);
    this.createHotelUseCase = new CreateHotel(this.repository);
  }

  public getRepository(): HotelRepository {
    return this.repository;
  }

  public static getInstance(): HotelService {
    if (!HotelService.instance) {
      HotelService.instance = new HotelService();
    }
    return HotelService.instance;
  }
}

export const hotelService = HotelService.getInstance();
