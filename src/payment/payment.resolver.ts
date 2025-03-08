import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { PaymentUnion } from "./payment.model";
import { PaymentService } from "./payment.service";
import { PubSub } from "graphql-subscriptions"; 
import { CreatePaymentDto } from "./dto/create-payment.dto";

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

  // @Subscription(() => PaymentUnion)
  // paymentMade() {
  //   return pubSub.asyncIterableIterator('paymentMade');
  // }

}