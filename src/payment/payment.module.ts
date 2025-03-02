import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardPayment, PaymentModel, PayPalPayment } from './payment.model';
import { InvoiceModel } from 'src/invoice/invoice.model';
import { PaymentResolver } from './payment.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentModel, CreditCardPayment, PayPalPayment, InvoiceModel])
  ],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentModule {}
