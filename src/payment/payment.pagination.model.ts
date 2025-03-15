import { Field, ObjectType } from "@nestjs/graphql";
import { PaymentUnion } from "./payment.model";



@ObjectType()
export class PaymentEdge {

  @Field(() => String)
  cursor: string;

  @Field(() => PaymentUnion)
  node: typeof PaymentUnion;

}

@ObjectType()
export class PaymentPageInfo {

  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor?: string
}

@ObjectType()
export class PaginatedPayments {
  @Field(() => [PaymentEdge])
  edges: PaymentEdge[];

  @Field(() => PaymentPageInfo)
  paymentPageInfo: PaymentPageInfo;
}