import { Field, ObjectType } from "@nestjs/graphql";
import { InvoiceModel } from "src/invoice/invoice.model";
import { ReviewModel } from "src/review/review.model";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@ObjectType()
@Entity()
export class CustomerModel {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 500, nullable: false })
  name: string;

  @OneToMany(type => InvoiceModel, invoice => invoice.customer)
  invoices: InvoiceModel[];

  @OneToMany(type => ReviewModel, (review) => review.customer)
  reviews: ReviewModel[];

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}