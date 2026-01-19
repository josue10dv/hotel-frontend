export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
}

export interface Host {
  name: string;
  avatar: string;
  isSuperHost: boolean;
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
  gallery: string[];
  amenities: string[];
  description: string;
  host: Host;
  reviews: Review[];
}

