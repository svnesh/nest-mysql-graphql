import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { PaymentUnion } from "./payment.model";
import { CreatePaymentDto, CreditCardDto, PaypalDto } from "./dto/create-payment.dto";
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
    @Args('invoiceId') invoiceId: string,
    @Args('amount') amount: number,
    @Args('paymentType') paymentType: string,
    @Args('paymentDetails') paymentDetails: string,
  ): Promise<typeof PaymentUnion> {
    
    const createdPayment = this.paymentService.createPayment(invoiceId, amount, paymentType, paymentDetails);
    pubSub.publish('paymentMade', { paymentMade: createdPayment })
    return createdPayment;

  }

  @Subscription(() => PaymentUnion)
  paymentMade() {
    return pubSub.asyncIterableIterator('paymentMade');
  }

}