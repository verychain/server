import { IsString, IsOptional, IsEnum } from "class-validator";
import { Grade } from "@prisma/client";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(Grade)
  grade?: Grade;
}
