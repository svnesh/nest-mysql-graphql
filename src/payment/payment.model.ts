import { createUnionType, Field, Float, InterfaceType, ObjectType } from "@nestjs/graphql";
import { InvoiceModel } from "src/invoice/invoice.model";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@InterfaceType()
abstract class PaymentMethod {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column()
  amount: number;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;
  
  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => InvoiceModel)
  @ManyToOne(() => InvoiceModel, (invoice) => invoice.creditCardPayments || invoice.payPalPayments)
  invoice: InvoiceModel;
}


@ObjectType({ implements: PaymentMethod })
@Entity()
export class CreditCardPayment extends PaymentMethod {
  @Field()
  @Column()
  cardNumber: string;
}

@ObjectType({ implements: PaymentMethod })
@Entity()
export class PayPalPayment extends PaymentMethod {
  @Field()
  @Column()
  paypalEmail: string;
}

export const PaymentUnion = createUnionType({
  name: 'PaymentUnion',
  types: () => [CreditCardPayment, PayPalPayment] as const,
  resolveType(value) {
    if ('cardNumber' in value) {
      return CreditCardPayment;
    }
    if ('paypalEmail' in value) {
      return PayPalPayment;
    }
    return null;
  }
});