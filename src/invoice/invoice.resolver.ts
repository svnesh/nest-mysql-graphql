import { Args, Mutation, Resolver } from "@nestjs/graphql";
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
    return await this.invoiceService.createInvoice(invoice);
  }

}
