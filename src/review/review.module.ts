import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModel } from './review.model';
import { CustomerModel } from 'src/customer/customer.model';
import { ReviewResolver } from './review.resolver';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewModel, CustomerModel])
  ],
  providers: [ReviewService, ReviewResolver, CustomerService]
})
export class ReviewModule {}
