// src/domain/user/service/userService.ts
import bcrypt from "bcrypt";
import { HttpError } from "@/common/error/errors";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../dto/createUserDto";
import { userRepository, UserRepository } from "../repository/userRepository";
import { generateJWT } from "@/common/utils/jwtUtils";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(body: any) {
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

  async signIn(body: any) {
    const { username, password } = body;

    // 1. find user by username
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new HttpError("Invalid signin information", 401);
    }

    // 2. compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("[signin@UserService] Invalid password");
      throw new HttpError("Invalid signin information", 401);
    }

    // 3. check if user is deleted
    if (user.deletedAt) {
      console.error("[signin@UserService] User is deleted");
      throw new HttpError("User is deleted", 403);
    }

    // 3. generate JWT token
    const token = generateJWT(user.username, user.role);
    
    return token;
  }

  async updateProfile(user: any, body: any) {
    // 1. input validation
    const dto = plainToInstance(CreateUserDto, body);
    dto.password = dto.password ? await bcrypt.hash(dto.password, 10) : user.password; // Do not change password if not provided
    const errors = await validate(dto);
    if (errors.length > 0) {
      console.log("[updateProfile@UserService] Validation errors:", errors);
      throw new HttpError("Invalid inputs", 400);
    }

    // 2. duplication check
    const phoneConflict = await this.userRepository.findUserByPhone(dto.phone);
    const nicknameConflict = await this.userRepository.findUserByNickname(dto.nickname);
    const usernameConflict = await this.userRepository.findUserByUsername(dto.username);

    const isConflict =
      (phoneConflict && phoneConflict.id !== user.id) ||
      (nicknameConflict && nicknameConflict.id !== user.id) ||
      (usernameConflict && usernameConflict.id !== user.id);
    if (isConflict) {
      console.log("[updateProfile@UserService] isConflict", isConflict);
      throw new HttpError("User information already exists", 409);
    }

    const updatedUser = await this.userRepository.updateUser(user.id, dto);
    if (!updatedUser) {
      console.error("[updateProfile@UserService] Failed to update user");
      throw new HttpError("Failed to update user", 500);
    }
    return ;
  }

  async deleteProfile(user: any) {
    const deletedUser = await this.userRepository.deleteUser(user.id);
    if (!deletedUser) {
      console.error("[deleteProfile@UserService] Failed to delete user");
      throw new HttpError("Failed to delete user", 500);
    }
    return deletedUser;
  }
}

// ========================================================
// Exporting an instance of UserService
// ========================================================
export const userService = new UserService(userRepository);