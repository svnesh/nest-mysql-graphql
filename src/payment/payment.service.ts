import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, CreditCardDto, PaypalDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardPayment, PaymentUnion, PayPalPayment } from './payment.model';
import { Repository } from 'typeorm';
import { InvoiceModel } from 'src/invoice/invoice.model';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(CreditCardPayment)
    private creditCardPaymentRepository: Repository<CreditCardPayment>,
    @InjectRepository(PayPalPayment)
    private paypalPaymentRepository: Repository<PayPalPayment>,
    @InjectRepository(InvoiceModel)
    private invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async createPayment(invoiceId: string, amount: number, paymentType: string, paymentDetails: string): Promise<typeof PaymentUnion> {
    const createdInvoice = await this.invoiceRepository.findOne({ where: { id: invoiceId }})
    if (!createdInvoice){
      throw new Error('Invoice not found');
    }

    if (paymentType == 'CreditCard'){
      const creditCardpayment = this.creditCardPaymentRepository.create({ amount, cardNumber: paymentDetails, invoice: createdInvoice});
      return await this.creditCardPaymentRepository.save(creditCardpayment);
    } else if (paymentType == 'PayPal') {
      let payPalpayment = this.paypalPaymentRepository.create({ amount, paypalEmail: paymentDetails, invoice: createdInvoice });
      return await this.paypalPaymentRepository.save(payPalpayment);
    } else {
      throw new Error('Invalid payment')
    }
  } 
}
