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
    return await this.customerRepository.save(details);
  }

  async findAll(): Promise<CustomerModel[]> {
    return await this.customerRepository.find();
  }

  async findOneCustomer(id: any): Promise<CustomerModel> {
    return await this.customerRepository.findOne(id);
  }


}