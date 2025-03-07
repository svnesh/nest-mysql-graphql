import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

// @InputType()
// export class CreditCardPaymentDto {
  
//   @Field()
//   @IsNotEmpty()
//   cardNumber: string

//   @Field()
//   @IsNotEmpty()
//   amount: number;

//   @Field()
//   @IsNotEmpty()
//   invoice: string;

  
// }

// @InputType()
// export class PaypalPaymentDto {
  
//   @Field()
//   @IsNotEmpty()
//   paypalEmail: string

//   @Field()
//   @IsNotEmpty()
//   amount: number;

//   @Field()
//   @IsNotEmpty()
//   invoice: string;

// }


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