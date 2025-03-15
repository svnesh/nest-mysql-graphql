import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardPayment, PaymentUnion, PayPalPayment } from './payment.model';
import { Repository } from 'typeorm';
import { InvoiceModel } from 'src/invoice/invoice.model';
import { PaginatedPayments, PaymentEdge, PaymentPageInfo } from './payment.pagination.model';

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
  
  async getPaginatedPayments(first: number, after?: string): Promise<PaginatedPayments> {

    const creditcardQuery = await this.creditCardPaymentRepository.createQueryBuilder('credit_card_payment')
      .orderBy('credit_card_payment.id', 'ASC');

    const paypalQuery = await this.paypalPaymentRepository.createQueryBuilder('pay_pal_payment')
      .orderBy('pay_pal_payment.id', 'ASC');

      
    const ccQuery = await creditcardQuery.getMany();
    const ppQuery = await paypalQuery.getMany();
    
    let allPayments = [...ccQuery, ...ppQuery];
      
    allPayments = allPayments.sort((a,b) => a.id.localeCompare(b.id));

    let startIndex = 0;
    if(after){
      const cursorIndex = allPayments.findIndex(payment => payment.id === after);
      if (cursorIndex !== -1){
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedPayments = allPayments.slice(startIndex, startIndex + first);
    const hasNextPage = allPayments.length > startIndex + first;

    const edges: PaymentEdge[] = paginatedPayments.map(payment => ({
      cursor: payment.id,
      node: payment
    }))

    const paymentPageInfo: PaymentPageInfo = {
      hasNextPage,
      endCursor: hasNextPage ? paginatedPayments[paginatedPayments.length - 1].id : null,
    };    
    
    return { edges, paymentPageInfo }
  }
}
