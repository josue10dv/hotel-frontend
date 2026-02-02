import { Wishlist, WishlistAddRequest, WishlistCheckResponse } from '../entities/Wishlist';

export interface WishlistRepository {
    getWishlist(): Promise<Wishlist>;
    addToWishlist(request: WishlistAddRequest): Promise<void>;
    removeFromWishlist(hotelId: string): Promise<void>;
    checkIsFavorite(hotelId: string): Promise<WishlistCheckResponse>;
    clearWishlist(): Promise<void>;
}
