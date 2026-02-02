import { Hotel, Address, Policies, Contact, Coordinates } from "../entities/Hotel";
import { HotelRepository } from "../repositories/HotelRepository";

export interface CreateHotelDTO {
    name: string;
    description: string;
    property_type: 'hotel' | 'apartment' | 'house' | 'room' | 'resort' | 'hostel';
    address: Address & { coordinates?: Coordinates };
    amenities: string[];
    services?: string[];
    images: string[];
    policies: Policies;
    contact?: Contact;
}

export class CreateHotel {
    constructor(private repository: HotelRepository) { }

    async execute(data: CreateHotelDTO): Promise<Hotel> {
        // Validaciones
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("El nombre del hotel es requerido");
        }

        if (!data.description || data.description.trim().length === 0) {
            throw new Error("La descripción del hotel es requerida");
        }

        if (!data.property_type) {
            throw new Error("El tipo de propiedad es requerido");
        }

        if (!data.address.street || !data.address.city || !data.address.country) {
            throw new Error("La dirección completa es requerida");
        }

        if (!data.images || data.images.length === 0) {
            throw new Error("Al menos una imagen es requerida");
        }

        return await this.repository.createHotel(data);
    }
}
