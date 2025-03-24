import { Field, ObjectType } from "@nestjs/graphql";
import { CustomerModel } from "src/customer/customer.model";
import { CreditCardPayment, PaymentUnion, PayPalPayment } from "src/payment/payment.model";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@ObjectType()
@Entity()
export class InvoiceModel {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 500, nullable: false })
  invoiceNo: string;

  @ManyToOne(type => CustomerModel, customer => customer.invoices)
  customer: CustomerModel;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CreditCardPayment, (creditCardPayment) => creditCardPayment.invoice)
  creditCardPayments: CreditCardPayment[];

  @OneToMany(() => PayPalPayment, (payPalPayment) => payPalPayment.invoice)
  payPalPayments: PayPalPayment[];

  @Field(() => [PaymentUnion])
  get Payments(): Array<CreditCardPayment | PayPalPayment> {
    return [...this.creditCardPayments, ...this.payPalPayments]
  }
}