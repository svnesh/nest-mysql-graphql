import { Field, ObjectType } from "@nestjs/graphql";
import { CustomerModel } from "src/customer/customer.model";
import { PaymentModel } from "src/payment/payment.model";
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

  @Field(() => PaymentModel)
  @OneToMany(() => PaymentModel, (payment) => payment.invoice)
  payments: PaymentModel[];
}