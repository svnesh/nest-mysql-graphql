import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";

export class CreateCustomerDto {

  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Length(15)
  phone: string;

  address: string;

}