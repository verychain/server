import { IsString, IsEmail } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  account: string;

  @IsString()
  password: string;
}
