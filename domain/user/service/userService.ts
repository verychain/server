// src/domain/user/service/userService.ts
import bcrypt from "bcrypt";
import { HttpError } from "@/common/error/errors";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../dto/createUserDto";
import { userRepository, UserRepository } from "../repository/userRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(body: any) {
    console.log("[signup@UserService] body:", body);
    // 1. input validation
    const dto = plainToInstance(CreateUserDto, body);
    dto.password = await bcrypt.hash(dto.password, 10);
    const errors = await validate(dto);
    if (errors.length > 0) {
      console.log("[signup@UserService] Validation errors:", errors);
      throw new HttpError("Invalid inputs", 400);
    }

    // 2. duplication check
    const isConflict =
      (await this.userRepository.findUserByPhone(dto.phone)) ||
      (await this.userRepository.findUserByNickname(dto.nickname)) ||
      (await this.userRepository.findUserByUsername(dto.username));

    if (isConflict) {
      console.log("[sigup@UserService] isConflict", isConflict);
      throw new HttpError("User information already exists", 409);
    }

    // 3. create user
    const user = await this.userRepository.createUser(dto);
    if (!user) {
      console.error("[signup@UserService] Failed to create user");
      throw new HttpError("Failed to create user", 500);
    }

    return user;
  }
}

// ========================================================
// Exporting an instance of UserService
// ========================================================
export const userService = new UserService(userRepository);