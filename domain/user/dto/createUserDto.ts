import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from "class-validator";
import { Grade, Role } from "@prisma/client";

export class CreateUserDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;

  @IsNumber()
  nation: number;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(Grade)
  grade?: Grade;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
