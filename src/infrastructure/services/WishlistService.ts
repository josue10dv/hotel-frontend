import { HttpWishlistRepository } from '../repositories/HttpWishlistRepository';
import { WishlistRepository } from '../../domain/repositories/WishlistRepository';

class WishlistService {
    private repository: WishlistRepository;

    constructor() {
        this.repository = new HttpWishlistRepository();
    }

    getRepository(): WishlistRepository {
        return this.repository;
    }
}

export const wishlistService = new WishlistService();
