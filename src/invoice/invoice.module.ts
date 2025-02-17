import { Module } from '@nestjs/common';
import { InvoiceService } from './invoce.service';

@Module({
  imports: [],
  providers: [InvoiceService],

})

export class InvoiceModule {}