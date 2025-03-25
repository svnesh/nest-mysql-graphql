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

  async getPaginatedInvoice(
    first: number, 
    after?: string,
    customerId?: string,
    minAmount?: number,
    maxAmount?: number,
    fromDate?: string,
    toDate?: string,
    sortBy?: 'createdAt' | 'amount',
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<PaginatedInvoices> {
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

    //Filtering by customer
    if (customerId){
      query.andWhere('invoice.customer = :customerId', { customerId });
    }

    //Filtering by min & max amount
    if (minAmount != undefined) {
      query.andWhere('invoice.amount >= :minAmount', { minAmount });
    }
    if (maxAmount != undefined){
      query.andWhere('invoice.amount <= :maxAmount', { maxAmount });
    }

    //Filtering by from Date & to Date
    if (fromDate != undefined) {
      query.andWhere('invoice.createdAt >= :fromDate', { fromDate });
    }
    if (toDate != undefined){
      query.andWhere('invoice.createdAt <= :toDate', { toDate });
    }

    //sorting logic
    if (sortBy){
      query.orderBy(`invoice.${sortBy}`, sortOrder ?? 'ASC')
    } else {
      query.orderBy(`invoice.id`, 'ASC');
    }

    const paginatedInvoices = await query
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


//paginated invoice with sorting
// query {
//   getPaginatedInvoice(
//     first: 10, 
//     customerId: "13a0c826-e000-4bd3-8c81-e9b2b0af2cd2",
//     minAmount: 100,
//     sortBy: "amount",
//     sortOrder: "DESC"
//   ) {
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