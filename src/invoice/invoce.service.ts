import { Repository } from "typeorm";
import { InvoiceModel } from "./invoice.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvoiceService {

  constructor(
    @InjectRepository(InvoiceModel)
    private invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async createInvoice(invoiceDto: any): Promise<InvoiceModel>{
    return this.invoiceRepository.save(invoiceDto)
  }

  async findByCustomerId(id: any) {
    return this.invoiceRepository.findBy({customer: id})
  }
  
}