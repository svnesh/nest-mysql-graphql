import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InvoiceModel } from "./invoice.model";
import { CreateInvoiceDto } from "./dto/invoice.dto";
import { InvoiceService } from "./invoce.service";


@Resolver(of => InvoiceModel)
export class InvoiceResolver {

  constructor(
    private readonly invoiceService: InvoiceService,
  ) {}

  @Mutation(returns => InvoiceModel)
  async createInvoice (
    @Args('invoice') invoice: CreateInvoiceDto,
  ): Promise<InvoiceModel> {
    return this.invoiceService.createInvoice(invoice);
  }

  @Query(() => InvoiceModel, { name: 'getInvoice'})
  async getInvoice(
    @Args('id') id: string): Promise<InvoiceModel> {
      return this.invoiceService.findOne(id);
    }

}

// Create invoice
// mutation{
//   createInvoice(invoice: {customer: "12feed1c-f689-4dd4-9107-03b83b0774c8", invoiceNo: "INV-222", amount: 3898.87}){
//     id
//     invoiceNo
//     amount
//   }
// }

// Get Invoice
// query {
//   getInvoice(id: "f2a603fd-0b3f-4f69-b01c-1907a475169b") {
//     id
//     Payments {
//       ... on CreditCardPayment {
//         id
//         amount
//         cardNumber
//       }
//       ... on PayPalPayment {
//         id
//         amount
//         paypalEmail
//       }
//     }
//   }
// }