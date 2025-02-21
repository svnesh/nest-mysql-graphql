import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModel } from './customer.model';
import { InvoiceModule } from 'src/invoice/invoice.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerModel]),
    InvoiceModule
  ],
  providers: [CustomerService, CustomerResolver],

})

export class CustomerModule {}