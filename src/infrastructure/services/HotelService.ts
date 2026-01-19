import { InMemoryHotelRepository } from "../repositories/InMemoryHotelRepository";
import { HttpHotelRepository } from "../repositories/HttpHotelRepository";
import { HotelRepository } from "../../domain/repositories/HotelRepository";
import { GetHotels } from "../../domain/usecases/GetHotels";
import { GetHotelById } from "../../domain/usecases/GetHotelById";
import { SearchHotels } from "../../domain/usecases/SearchHotels";
import { FilterHotelsByCategory } from "../../domain/usecases/FilterHotelsByCategory";

type RepositoryMode = 'http' | 'memory';

class HotelService {
  private static instance: HotelService;
  private repository: HotelRepository;
  private mode: RepositoryMode;

  public getHotelsUseCase: GetHotels;
  public getHotelByIdUseCase: GetHotelById;
  public searchHotelsUseCase = new SearchHotels();
  public filterHotelsByCategoryUseCase = new FilterHotelsByCategory();

  private constructor(mode: RepositoryMode = 'http') {
    this.mode = mode;
    this.repository = this.createRepository(mode);
    this.getHotelsUseCase = new GetHotels(this.repository);
    this.getHotelByIdUseCase = new GetHotelById(this.repository);
  }

  private createRepository(mode: RepositoryMode): HotelRepository {
    if (mode === 'http') {
      return new HttpHotelRepository();
    }
    return new InMemoryHotelRepository();
  }

  public switchMode(mode: RepositoryMode): void {
    if (this.mode !== mode) {
      this.mode = mode;
      this.repository = this.createRepository(mode);
      this.getHotelsUseCase = new GetHotels(this.repository);
      this.getHotelByIdUseCase = new GetHotelById(this.repository);
    }
  }

  public getCurrentMode(): RepositoryMode {
    return this.mode;
  }

  public static getInstance(mode: RepositoryMode = 'http'): HotelService {
    if (!HotelService.instance) {
      HotelService.instance = new HotelService(mode);
    }
    return HotelService.instance;
  }
}

const USE_HTTP = import.meta.env.VITE_USE_MOCK !== 'true';
export const hotelService = HotelService.getInstance(USE_HTTP ? 'http' : 'memory');
