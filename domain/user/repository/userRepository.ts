import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "../dto/createUserDto";
import { UpdateUserDto } from "../dto/updateUserDto";

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByAccount(account: string) {
    return await this.prisma.user.findUnique({
      where: { account },
    });
  }

  async findUserByPhone(phone: string) {
    return await this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async createUser(userData: CreateUserDto) {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: string, userData: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = UserRepository;
