import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export class CreatePaymentDto {

  @Field()
  @IsNotEmpty()
  invoice: string;

  @Field()
  amount: string;

  @Field()
  paymentType: string;

  @Field()
  paymentDetail: string;

}