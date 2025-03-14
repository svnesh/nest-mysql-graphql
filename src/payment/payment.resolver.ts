import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PaymentUnion } from "./payment.model";
import { PaymentService } from "./payment.service";
import { PubSub } from "graphql-subscriptions"; 
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaginatedPayments } from "./payment.pagination.model";

const pubSub = new PubSub()

@Resolver(() => PaymentUnion)
export class PaymentResolver {

  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Mutation(() => PaymentUnion)
  async createPayment(@Args('payment') createPaymentDto: CreatePaymentDto): Promise<typeof PaymentUnion> {
    
    const createdPayment = this.paymentService.createPayment(createPaymentDto);
    pubSub.publish('paymentMade', { paymentMade: createdPayment })
    return createdPayment;

  }

  @Query(() => PaginatedPayments)
  async getPaginatedPayments(
    @Args('first', { type: () => Number, nullable: true, defaultValue: 10 }) first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string, 
  ): Promise<PaginatedPayments> {
    return this.paymentService.getPaginatedPayments(first, after);
  }

  @Subscription(() => PaymentUnion)
  paymentMade() {
    return pubSub.asyncIterableIterator('paymentMade');
  }

}