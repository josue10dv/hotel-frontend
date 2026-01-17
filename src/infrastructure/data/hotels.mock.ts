/**
 * @typedef {Object} Coordinates
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} Hotel
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} country
 * @property {number} pricePerNight
 * @property {number} rating
 * @property {string} category
 * @property {Coordinates} coordinates
 * @property {string} imageUrl
 * @property {string[]} amenities
 */

export const INITIAL_HOTELS = [
    {
        id: "1",
        name: "Grand Plaza Hotel",
        city: "New York",
        country: "USA",
        pricePerNight: 350,
        rating: 4.8,
        category: "Luxury",
        coordinates: { lat: 40.7128, lng: -74.006 },
        imageUrl: "https://placehold.co/600x400/2563eb/ffffff?text=Grand+Plaza",
        amenities: ["Pool", "Spa", "WiFi", "Gym"],
    },
    {
        id: "2",
        name: "Seaside Resort",
        city: "Miami",
        country: "USA",
        pricePerNight: 280,
        rating: 4.5,
        category: "Resort",
        coordinates: { lat: 25.7617, lng: -80.1918 },
        imageUrl: "https://placehold.co/600x400/10b981/ffffff?text=Seaside+Resort",
        amenities: ["Beach Access", "Pool", "Bar", "WiFi"],
    },
    {
        id: "3",
        name: "Mountain View Lodge",
        city: "Denver",
        country: "USA",
        pricePerNight: 180,
        rating: 4.6,
        category: "Cabin",
        coordinates: { lat: 39.7392, lng: -104.9903 },
        imageUrl: "https://placehold.co/600x400/d97706/ffffff?text=Mountain+View",
        amenities: ["Hiking", "Fireplace", "WiFi", "Parking"],
    },
    {
        id: "4",
        name: "Urban Boutique Hotel",
        city: "San Francisco",
        country: "USA",
        pricePerNight: 220,
        rating: 4.3,
        category: "Boutique",
        coordinates: { lat: 37.7749, lng: -122.4194 },
        imageUrl: "https://placehold.co/600x400/9333ea/ffffff?text=Urban+Boutique",
        amenities: ["Rooftop Bar", "WiFi", "Gym"],
    },
    {
        id: "5",
        name: "Lakeside Inn",
        city: "Chicago",
        country: "USA",
        pricePerNight: 150,
        rating: 4.2,
        category: "Standard",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        imageUrl: "https://placehold.co/600x400/dc2626/ffffff?text=Lakeside+Inn",
        amenities: ["Lake View", "WiFi", "Breakfast"],
    },
    {
        id: "6",
        name: "Desert Oasis",
        city: "Phoenix",
        country: "USA",
        pricePerNight: 200,
        rating: 4.7,
        category: "Resort",
        coordinates: { lat: 33.4484, lng: -112.074 },
        imageUrl: "https://placehold.co/600x400/f59e0b/ffffff?text=Desert+Oasis",
        amenities: ["Pool", "AC", "WiFi"],
    },
    {
        id: "7",
        name: "Historic Downtown Hotel",
        city: "Boston",
        country: "USA",
        pricePerNight: 260,
        rating: 4.4,
        category: "Historic",
        coordinates: { lat: 42.3601, lng: -71.0589 },
        imageUrl: "https://placehold.co/600x400/4b5563/ffffff?text=Historic+Downtown",
        amenities: ["Restaurant", "WiFi", "Concierge"],
    },
    {
        id: "8",
        name: "Sunny California Motel",
        city: "Los Angeles",
        country: "USA",
        pricePerNight: 120,
        rating: 3.9,
        category: "Motel",
        coordinates: { lat: 34.0522, lng: -118.2437 },
        imageUrl: "https://placehold.co/600x400/ec4899/ffffff?text=Sunny+Motel",
        amenities: ["Parking", "WiFi", "Pool"],
    },
    {
        id: "9",
        name: "Rustic Cabin",
        city: "Seattle",
        country: "USA",
        pricePerNight: 190,
        rating: 4.5,
        category: "Cabin",
        coordinates: { lat: 47.6062, lng: -122.3321 },
        imageUrl: "https://placehold.co/600x400/059669/ffffff?text=Rustic+Cabin",
        amenities: ["Nature Trails", "WiFi", "Kitchen"],
    },
    {
        id: "10",
        name: "Business Executive Suites",
        city: "New York",
        country: "USA",
        pricePerNight: 400,
        rating: 4.9,
        category: "Business",
        coordinates: { lat: 40.758, lng: -73.9855 },
        imageUrl: "https://placehold.co/600x400/1e293b/ffffff?text=Business+Suites",
        amenities: ["Conference Room", "WiFi", "Gym"],
    },
    {
        id: "11",
        name: "Family Fun Resort",
        city: "Orlando",
        country: "USA",
        pricePerNight: 230,
        rating: 4.6,
        category: "Resort",
        coordinates: { lat: 28.5383, lng: -81.3792 },
        imageUrl: "https://placehold.co/600x400/8b5cf6/ffffff?text=Family+Resort",
        amenities: ["Water Park", "Kids Club", "WiFi"],
    },
    {
        id: "12",
        name: "Eco Friendly Lodge",
        city: "Portland",
        country: "USA",
        pricePerNight: 175,
        rating: 4.7,
        category: "Eco",
        coordinates: { lat: 45.5152, lng: -122.6784 },
        imageUrl: "https://placehold.co/600x400/14b8a6/ffffff?text=Eco+Lodge",
        amenities: ["Solar Power", "Organic Food", "WiFi"],
    },
];
