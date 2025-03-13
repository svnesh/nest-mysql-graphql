import { Repository } from "typeorm";
import { InvoiceModel } from "./invoice.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CustomerService } from "src/customer/customer.service";
import { InvoiceEdge, PageInfo, PaginatedInvoices } from "./invoice.pagination.model";

@Injectable()
export class InvoiceService {

  constructor(
    @InjectRepository(InvoiceModel)
    private invoiceRepository: Repository<InvoiceModel>,
    private readonly customerService: CustomerService,
  ) {}

  async createInvoice(invoiceDto: any): Promise<InvoiceModel>{
    const customerExists = await this.customerService.findOneCustomer(invoiceDto.customer)
    if (!customerExists){
      throw new Error('Customer not found');
    }
    return this.invoiceRepository.save(invoiceDto)
  }

  async findByCustomerId(id: any) {
    return this.invoiceRepository.findBy({customer: id})
  }

  async findOne(id: string): Promise<InvoiceModel> {
    return this.invoiceRepository.findOne({
      where: { id },
      relations: ['creditCardPayments', 'payPalPayments']
    })
  }

  async getPaginatedInvoice(first: number, after?: string): Promise<PaginatedInvoices> {

    const query = await this.invoiceRepository.createQueryBuilder('invoice')
      .orderBy('invoice.id', 'ASC')
      .take(first + 1);  //taking 1 extra to check next

    if (after){
      query.andWhere('invoice.id > :cursor', { cursor: after })
    }

    const invoices = await query.getMany();
    const hasNextPage = invoices.length > first;
    if (hasNextPage) invoices.pop();

    const edges: InvoiceEdge[] = invoices.map((invoice) => ({
      cursor: invoice.id.toString(),
      node: invoice
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: hasNextPage ? invoices[invoices.length -1].id.toString() : null
    }

    return {edges, pageInfo };
  }
  
}