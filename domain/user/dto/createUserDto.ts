import { IsString, IsEmail, IsOptional, IsEnum } from "class-validator";
import { Grade, Role } from "@prisma/client";

export class CreateUserDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;

  @IsString()
  nation: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(Grade)
  grade?: Grade;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
