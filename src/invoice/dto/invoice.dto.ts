import { Field, InputType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

@InputType()
export class CreateInvoiceDto {
  @Field()
  customer: string;
  
  @Field()
  invoiceNo: string;

  @Field()
  @IsNumber()
  amount: number
}