import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerModel } from "./customer.model";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dto/customer.dto";


@Injectable()
export class CustomerService {

  constructor(

    @InjectRepository(CustomerModel)
    private customerRepository: Repository<CustomerModel>,

  ) {}

  async create (details: CreateCustomerDto): Promise<CustomerModel> {
    return this.customerRepository.save(details);
  }

  async findAll(): Promise<CustomerModel[]> {
    return this.customerRepository.find({relations: ['invoices']});
  }

  async findOneCustomer(id: any): Promise<CustomerModel> {
    return this.customerRepository.findOne({
      where: {
        id: id
      },
      relations: ['invoices']
    });
  }


}