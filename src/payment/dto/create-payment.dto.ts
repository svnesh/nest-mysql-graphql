import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreditCardDto {
  
  @Field()
  @IsNotEmpty()
  cardNumber: string

  @Field()
  @IsNotEmpty()
  amount: number;
}

@InputType()
export class PaypalDto {
  
  @Field()
  @IsNotEmpty()
  paypalEmail: string

  @Field()
  @IsNotEmpty()
  amount: number;
}


@InputType()
export class CreatePaymentDto {

  @Field()
  @IsNotEmpty()
  invoice: string;

  @Field()
  amount: number;

  @Field()
  paymentType: string;

  @Field()
  paymentDetail: string;

}