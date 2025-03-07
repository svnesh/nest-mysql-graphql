import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, } from './dto/create-payment.dto';
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

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<typeof PaymentUnion> {
    const createdInvoice = await this.invoiceRepository.findOne({ where: { id: createPaymentDto.invoice }})
    if (!createdInvoice){
      throw new Error('Invoice not found');
    }

    if (createPaymentDto.paymentType == 'CreditCard'){
      const creditCardpayment = this.creditCardPaymentRepository.create({ amount: createPaymentDto.amount, cardNumber: createPaymentDto.paymentDetail, invoice: createdInvoice});
      return await this.creditCardPaymentRepository.save(creditCardpayment);
    } else if (createPaymentDto.paymentType == 'PayPal') {
      let payPalpayment = this.paypalPaymentRepository.create({ amount: createPaymentDto.amount, paypalEmail: createPaymentDto.paymentDetail, invoice: createdInvoice });
      return await this.paypalPaymentRepository.save(payPalpayment);
    } else {
      throw new Error('Invalid payment')
    }
  } 
}
