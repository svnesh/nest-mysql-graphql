import { Module } from '@nestjs/common';
import { InvoiceService } from './invoce.service';
import { InvoiceResolver } from './invoice.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModel } from './invoice.model';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceModel])],
  providers: [InvoiceService, InvoiceResolver],
  exports: [InvoiceService],
})

export class InvoiceModule {}