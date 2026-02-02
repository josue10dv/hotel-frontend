import { httpClient } from '../api/HttpClient';
import { API_ENDPOINTS } from '../../config/api.config';
import { WishlistRepository } from '../../domain/repositories/WishlistRepository';
import { Wishlist, WishlistAddRequest, WishlistCheckResponse } from '../../domain/entities/Wishlist';

export class HttpWishlistRepository implements WishlistRepository {
    async getWishlist(): Promise<Wishlist> {
        return await httpClient.get<Wishlist>(API_ENDPOINTS.wishlist.list);
    }

    async addToWishlist(request: WishlistAddRequest): Promise<void> {
        await httpClient.post(API_ENDPOINTS.wishlist.add, request);
    }

    async removeFromWishlist(hotelId: string): Promise<void> {
        await httpClient.delete(API_ENDPOINTS.wishlist.remove(hotelId));
    }

    async checkIsFavorite(hotelId: string): Promise<WishlistCheckResponse> {
        return await httpClient.get<WishlistCheckResponse>(API_ENDPOINTS.wishlist.check(hotelId));
    }

    async clearWishlist(): Promise<void> {
        await httpClient.delete(API_ENDPOINTS.wishlist.clear);
    }
}
