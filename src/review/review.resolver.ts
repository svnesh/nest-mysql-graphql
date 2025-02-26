import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ReviewModel } from "./review.model";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create.review.dto";

@Resolver(of => ReviewModel)
export class ReviewResolver {
  
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @Mutation(returns => ReviewModel)
  async createReview (
    @Args('createReview') createReview: CreateReviewDto
  ): Promise<ReviewModel> {
    return this.reviewService.createReview(createReview);
  }

  @Query(returns => [ReviewModel], {nullable: true})
  async getReviews(): Promise<ReviewModel[]> {
    return this.reviewService.findAll();
  }

}