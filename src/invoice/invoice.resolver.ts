import { Args, Float, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InvoiceModel } from "./invoice.model";
import { CreateInvoiceDto } from "./dto/invoice.dto";
import { InvoiceService } from "./invoice.service";
import { PaginatedInvoices } from "./invoice.pagination.model";
import { CreditCardPayment, PaymentUnion, PayPalPayment } from "src/payment/payment.model";


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

  @Query(() => PaginatedInvoices, { name: 'getPaginatedInvoice'} )
  async getPaginatedInvoice(
    @Args('first', { type: () => Number, nullable: true, defaultValue: 10 }) first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string,
    @Args('customerId', { type: () => String, nullable: true }) customerId?: string,
    @Args('minAmount', { type: () => Float, nullable: true }) minAmount?: number,
    @Args('maxAmount', { type: () => Float, nullable: true }) maxAmount?: number,
    @Args('fromDate', { type: () => String, nullable: true }) fromDate?: string,
    @Args('toDate', { type: () => String, nullable: true }) toDate?: string,
    @Args('sortBy', { type: () => String, nullable: true }) sortBy?: 'createdAt' | 'amount',
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder?: 'ASC' | 'DESC',
    @Args('searchTerm', { type: () => String, nullable: true }) searchTerm?: string,
    @Args('paymentMethod', { type: () => String, nullable: true }) paymentMethod?: 'CreditCard' | 'PayPal',
  ): Promise<PaginatedInvoices> {
    return this.invoiceService.getPaginatedInvoice(first, after, customerId, minAmount, maxAmount, fromDate, toDate, sortBy, sortOrder, searchTerm, paymentMethod);
  }

  @ResolveField(() => [PaymentUnion])
  async Payments(@Parent() invoice: InvoiceModel): Promise<Array<CreditCardPayment | PayPalPayment>> {
    return [...(invoice.creditCardPayments || []), ...(invoice.payPalPayments || [])];
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

// Get paginated Invoice
// query {
//   getPaginatedInvoice(first: 2, after: "60d00c09-ce85-4e2b-8a6b-c86f4f878482") {
//     edges {
//       cursor
//       node {
//         id
//         amount
//       }
//     }
//     pageInfo {
//       hasNextPage
//       endCursor
//     }
//   }
// }