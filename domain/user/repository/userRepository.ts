import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "../dto/createUserDto";
import { UpdateUserDto } from "../dto/updateUserDto";

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findUserByPhone(phone: string) {
    return await this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async findUserByNickname(nickname: string) {
    return await this.prisma.user.findUnique({
      where: { nickname },
    });
  }

  async createUser(userData: CreateUserDto) {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number) {
    // not delete row, just update deletedAt
    // return await this.prisma.user.delete({
    //   where: { id },
    // });

    return await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }, // Soft delete
    });
  }

  async upsertWallet(userId: string, address: string) {
    return await this.prisma.wallet.upsert({
      where: { userId },
      update: { address },
      create: {
        userId,
        address,
      },
    });
  }

  async findWalletByUserId(userId: string) {
    return await this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async findWalletByAddress(address: string) {
    return await this.prisma.wallet.findUnique({
      where: { address },
    });
  }
}

// ========================================================
// Exporting an instance of UserRepository
// ========================================================
export const userRepository = new UserRepository();