import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardPayment, PaymentUnion, PayPalPayment } from './payment.model';
import { Repository } from 'typeorm';
import { InvoiceModel } from 'src/invoice/invoice.model';
import { PageInfo, PaginatedPayments, PaymentEdge } from './payment.pagination.model';

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

    if (after) {
      creditcardQuery.andWhere('credit_card_payment.id > :cursor', {cursor: after })
      paypalQuery.andWhere('pay_pal_payment.id > :cursor', {cursor: after })
    }
    
    const ccQuery = await creditcardQuery.getMany();
    const ppQuery = await paypalQuery.getMany();

    const allPayments = [...ccQuery, ...ppQuery];

    const sortedPayments = allPayments.sort((a,b) => {
      const date_a = new Date(a.createdAt);
      const date_b = new Date(b.createdAt);
      if (date_a < date_b){
        return -1;
      }
      if(date_a > date_b){
        return 1;
      }
      return 0;
    });
    
    const hasNextPage = sortedPayments.length > first;
    if (hasNextPage) sortedPayments.pop();

    const edges: PaymentEdge[] = sortedPayments.map((payment) => ({
      cursor: payment.id.toString(),
      node: payment
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: hasNextPage ? sortedPayments[sortedPayments.length - 1].id.toString() : null
    }

    return { edges, pageInfo}
  }
}
