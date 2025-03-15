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
    let cursorIdx = -1, invoices = [];
    
    if (after){
      const queryAfter = this.invoiceRepository.createQueryBuilder('invoice');
      invoices = await queryAfter.select('invoice.id').orderBy('invoice.id', 'ASC').getMany();
      invoices.sort((a,b) => a.id.localeCompare(b.id));
      cursorIdx = invoices.findIndex(invoice => invoice.id === after);
    }
    const query = this.invoiceRepository.createQueryBuilder('invoice');
    if (cursorIdx !== -1){
      query.andWhere('invoice.id > :cursor', { cursor: invoices[cursorIdx].id })
    }
    
    const paginatedInvoices = await query
      .orderBy('invoice.id')
      .take(first)
      .getMany()

    const hasNextPage = paginatedInvoices.length === first;
    const endCursor = hasNextPage ? paginatedInvoices[paginatedInvoices.length - 1].id : null;
   
    const edges: InvoiceEdge[] = paginatedInvoices.map((invoice) => ({
      cursor: invoice.id,
      node: invoice
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: endCursor
    }
    return {edges, pageInfo };
  }
  
}