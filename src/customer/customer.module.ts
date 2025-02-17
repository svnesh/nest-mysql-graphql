import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModel } from './customer.model';
import { InvoiceService } from 'src/invoice/invoce.service';


@Module({
  imports: [TypeOrmModule.forFeature([CustomerModel])],
  providers: [CustomerService, CustomerResolver, InvoiceService],

})

export class CustomerModule {}