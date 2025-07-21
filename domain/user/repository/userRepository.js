const prisma = require("../../../common/config/dbConfig");

class UserRepository {
  constructor() {
    this.prisma = prisma;
  }

  async findAllUser() {
    return await this.prisma.user.findAll();
  }

  async findById(id) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(userData) {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id, userData) {
    return await this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = UserRepository;
