import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CustomerModel } from "./customer.model";
import { Inject } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { InvoiceService } from "src/invoice/invoce.service";
import { InvoiceModel } from "src/invoice/invoice.model";


@Resolver(of => CustomerModel)
export class CustomerResolver {

  constructor(
    @Inject(CustomerService) private customerService: CustomerService,
    @Inject(InvoiceService) private invoiceService: InvoiceService,
  ) {}

  @Query(returns => CustomerModel)
  async customer(@Args('id') id: string): Promise<CustomerModel> {
    return await this.customerService.findOneCustomer(id);
  }

  @Query(returns => [CustomerModel])
  async customers(): Promise<CustomerModel[]> {
    return await this.customerService.findAll();
  }

  @ResolveField(returns => [InvoiceModel])
  async invoices(@Parent() customer): Promise<InvoiceModel[]> {
    const { id } = customer;
    return this.invoiceService.findByCustomerId(id);
  }

  @Mutation(returns => CustomerModel)
  async createCustomer (
    @Args('name') name: string,
  ): Promise<CustomerModel> {
    return await this.customerService.create({ name });
  }


}