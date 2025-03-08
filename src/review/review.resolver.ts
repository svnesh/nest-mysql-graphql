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


// Create review
// mutation{
//   createReview(createReview: {customer: "13a0c826-e000-4bd3-8c81-e9b2b0af2cd2", rating: 1, comment: "very bad" }){
//     id
//     rating
//     comment
//   }
// }