import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";

export class CreateCustomerDto {

  @IsNotEmpty()
  name: string;
}