import { Field, InputType } from "@nestjs/graphql";
import { Currency, PaymentStatus } from "../invoice.model";

@InputType()
class ItemDto {
  @Field()
  description: string;
  @Field()
  rate: number;
  @Field()
  quantity: number;
}

@InputType()
export class CreateInvoiceDto {
  @Field()
  customer: string;
  @Field()
  invoiceNo: string;
  @Field()
  paymentStatus: PaymentStatus;
  @Field()
  description: string;
  @Field()
  currency: Currency;
  @Field()
  taxRate: number;
  @Field()
  issueDate: Date;
  @Field()
  dueDate: Date;
  @Field()
  note: string;
  @Field(type => [ItemDto])
  items: Array<{ description: string, rate: number, quantity: number }>
}