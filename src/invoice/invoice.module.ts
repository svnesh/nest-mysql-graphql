import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModel } from './invoice.model';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerModel } from 'src/customer/customer.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceModel, CustomerModel]),
  ],
  providers: [InvoiceService, InvoiceResolver, CustomerService],
  exports: [InvoiceService],
})

export class InvoiceModule {}