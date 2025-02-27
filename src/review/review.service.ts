import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewModel } from './review.model';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create.review.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(ReviewModel)
    private reviewRepository: Repository<ReviewModel>,
    private readonly customerService: CustomerService,
  ) {}

  async createReview(createReviewDto: any): Promise<ReviewModel> {
    const customerExists = await this.customerService.findOneCustomer(createReviewDto.customer)
    if (!customerExists){
      throw new Error('Customer not found');
    }
    const review = await this.reviewRepository.save(createReviewDto);
    return review;
  }

  async findAll() {
    return this.reviewRepository.find({relations: ['customer']});
  }

}
