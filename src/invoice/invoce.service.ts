import { Repository } from "typeorm";
import { InvoiceModel } from "./invoice.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CustomerService } from "src/customer/customer.service";

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
  
}