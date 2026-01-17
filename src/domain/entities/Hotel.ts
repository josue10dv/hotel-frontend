export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  category: string;
  coordinates: Coordinates;
  imageUrl: string;
  amenities: string[];
}
