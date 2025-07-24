import { Grade, Role } from "@prisma/client";

export class UserResponseDto {
  id: string;
  account: string;
  nickname: string;
  nation: string;
  phone: string;
  grade: Grade;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
