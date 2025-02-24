import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateInvoiceDto {
  @Field()
  customer: string;
  
  @Field()
  invoiceNo: string;

  @Field()
  amount: number
}