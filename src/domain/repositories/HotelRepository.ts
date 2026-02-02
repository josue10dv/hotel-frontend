import { Hotel, Room } from "../entities/Hotel";
import { CreateHotelDTO } from "../usecases/CreateHotel";

export interface HotelSearchParams {
    q?: string; // Término de búsqueda
    page?: number;
    page_size?: number;
    city?: string;
    country?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    amenities?: string;
    guests?: number;
}

export interface AddRoomDTO {
    name: string;
    description: string;
    type: 'single' | 'double' | 'twin' | 'suite' | 'deluxe' | 'family' | 'studio';
    capacity: number;
    price_per_night: number;
    available?: boolean;
    amenities?: string[];
    images?: string[];
}

export interface HotelRepository {
    // CRUD básico
    getHotels(): Promise<Hotel[]>;
    getHotelById(id: string): Promise<Hotel | undefined>;
    createHotel(data: CreateHotelDTO): Promise<Hotel>;
    updateHotel(id: string, data: Partial<CreateHotelDTO>): Promise<Hotel>;
    deleteHotel(id: string, permanent?: boolean): Promise<void>;

    // Consultas específicas
    getMyHotels(): Promise<Hotel[]>;
    searchHotels(params: HotelSearchParams): Promise<Hotel[]>;

    // Gestión de habitaciones
    addRoom(hotelId: string, roomData: AddRoomDTO): Promise<Room>;
    updateRoom(hotelId: string, roomId: string, roomData: Partial<AddRoomDTO>): Promise<Room>;
    deleteRoom(hotelId: string, roomId: string): Promise<void>;
}


