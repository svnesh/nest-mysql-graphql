import { Field, ObjectType } from "@nestjs/graphql";
import { InvoiceModel } from "./invoice.model";


@ObjectType()
export class InvoiceEdge {

  @Field(() => String)
  cursor: string;

  @Field(() => InvoiceModel)
  node: InvoiceModel;

}

@ObjectType()
export class PageInfo {

  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor?: string
}

@ObjectType()
export class PaginatedInvoices {
  @Field(() => [InvoiceEdge])
  edges: InvoiceEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}