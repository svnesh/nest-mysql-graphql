import { createUnionType, Field, Float, InterfaceType, ObjectType } from "@nestjs/graphql";
import { InvoiceModel } from "src/invoice/invoice.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@InterfaceType()
abstract class PaymentMethod {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column()
  amount: number;

  @Field(() => InvoiceModel)
  @ManyToOne(() => InvoiceModel, (invoice) => invoice.Payments)
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
  types: () => [CreditCardPayment, PayPalPayment],
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

// @ObjectType()
// @Entity()
// export class PaymentModel {

//   @Field()
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Field(() => Float)
//   @Column()
//   amount: number;

//   @Field(() => InvoiceModel)
//   @ManyToOne(() => InvoiceModel, (invoice) => invoice.payments)
//   invoice: InvoiceModel;
// }
