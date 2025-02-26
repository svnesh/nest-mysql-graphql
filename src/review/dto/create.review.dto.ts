import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class CreateReviewDto {

  @Field()
  customer: string;
  
  @Field()
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @Field()
  @IsString()
  comment: string;
  
}