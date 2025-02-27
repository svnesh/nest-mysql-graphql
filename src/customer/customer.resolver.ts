import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CustomerModel } from "./customer.model";
import { Inject } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { InvoiceService } from "src/invoice/invoce.service";
import { InvoiceModel } from "src/invoice/invoice.model";
import { ReviewModel } from "src/review/review.model";


@Resolver(of => CustomerModel)
export class CustomerResolver {

  constructor(
    @Inject(CustomerService) private customerService: CustomerService,
    @Inject(InvoiceService) private invoiceService: InvoiceService,
  ) {}

  @Query(returns => CustomerModel, { nullable: true})
  async customer(@Args('id') id: string): Promise<CustomerModel | ReviewModel> {
    return this.customerService.findOneCustomer(id);
  }

  @Query(returns => [CustomerModel], {nullable: true})
  async customers(): Promise<CustomerModel[]> {
    return this.customerService.findAll();
  }

  @ResolveField(returns => [InvoiceModel])
  async invoices(@Parent() customer): Promise<InvoiceModel[]> {
    return customer.invoices;
  }

  @ResolveField(returns => [ReviewModel])
  async reviews(@Parent() customer): Promise<ReviewModel[]> {
    return customer.reviews;
  }

  @Mutation(returns => CustomerModel)
  async createCustomer (
    @Args('name') name: string,
  ): Promise<CustomerModel> {
    return this.customerService.create({ name });
  }


}