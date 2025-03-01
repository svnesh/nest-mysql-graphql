import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { PaymentModel, PaymentUnion } from "./payment.model";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaymentService } from "./payment.service";
import { PubSub } from "graphql-subscriptions"; 

const pubSub = new PubSub()

@Resolver(() => PaymentUnion)
export class PaymentResolver {

  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Mutation(() => PaymentUnion)
  async createPayment(
    @Args('payment') payment: CreatePaymentDto,
  ): Promise<typeof PaymentUnion> {
    
    const createdPayment = this.paymentService.createPayment(payment);
    pubSub.publish('paymentMade', { paymentMade: createdPayment })
    return createdPayment;

  }

  @Subscription(() => PaymentUnion)
  paymentMade() {
    return pubSub.asyncIterableIterator('paymentMade');
  }

}