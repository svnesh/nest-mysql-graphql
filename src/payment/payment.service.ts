import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardPayment, PaymentModel, PayPalPayment } from './payment.model';
import { Repository } from 'typeorm';
import { InvoiceModel } from 'src/invoice/invoice.model';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(PaymentModel)
    private paymentRepository: Repository<PaymentModel>,
    @InjectRepository(CreditCardPayment)
    private creditCardPaymentRepository: Repository<CreditCardPayment>,
    @InjectRepository(PayPalPayment)
    private paypalPaymentRepository: Repository<PayPalPayment>,
    @InjectRepository(InvoiceModel)
    private invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const createdInvoice = await this.invoiceRepository.findOne({ where: { id: createPaymentDto.invoice }})
    if (!createdInvoice){
      throw new Error('Invoice not found');
    }

    let payment;
    if (createPaymentDto.paymentType == 'CreditCard'){
      payment = await this.creditCardPaymentRepository.create(createPaymentDto.paymentDetail);
    } else if (createPaymentDto.paymentType == 'PayPal') {
      payment = await this.paypalPaymentRepository.create(createPaymentDto.paymentDetail);
    } else {
      throw new Error('Invalid payment')
    }
    return this.paymentRepository.save(payment);
  }

}
