import { HttpReviewRepository } from "../repositories/HttpReviewRepository";
import { ReviewRepository } from "../../domain/repositories/ReviewRepository";

class ReviewService {
    private static instance: ReviewService;
    private repository: ReviewRepository;

    private constructor() {
        this.repository = new HttpReviewRepository();
    }

    public static getInstance(): ReviewService {
        if (!ReviewService.instance) {
            ReviewService.instance = new ReviewService();
        }
        return ReviewService.instance;
    }

    public getRepository(): ReviewRepository {
        return this.repository;
    }
}

export const reviewService = ReviewService.getInstance();
