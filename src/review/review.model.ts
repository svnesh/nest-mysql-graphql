import { Field, Float, ObjectType } from "@nestjs/graphql";
import { CustomerModel } from "src/customer/customer.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()
@Entity()
export class ReviewModel {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column("decimal", { precision: 2, scale: 1 })
  rating: number;

  @Field()
  @Column()
  comment: string;

  @ManyToOne(() => CustomerModel, (customer) => customer.reviews)
  customer: CustomerModel;
}