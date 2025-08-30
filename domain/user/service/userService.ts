// src/domain/user/service/userService.ts
import bcrypt from "bcrypt";
import { HttpError } from "@/common/error/errors";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../dto/createUserDto";
import { userRepository, UserRepository } from "../repository/userRepository";
import { generateJWT } from "@/common/utils/jwtUtils";
import { nationCodeMap } from "@/common/model/types/nationCode";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(body: any) {
    // 1. input validation
    const dto = plainToInstance(CreateUserDto, body);
    dto.password = await bcrypt.hash(dto.password, 10);
    const isValidNationCode = dto.nation in nationCodeMap;
    const errors = await validate(dto);
    if (errors.length > 0 || !isValidNationCode) {
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
    const token = generateJWT(user.username, user.role );
    
    return token;
  }

  async updateProfile(user: any, body: any) {
    // 1. input validation
    const dto = plainToInstance(CreateUserDto, body);
    dto.password = dto.password ? await bcrypt.hash(dto.password, 10) : user.password; // Do not change password if not provided
    const errors = await validate(dto);
    const isValidNationCode = dto.nation in nationCodeMap;
    if (errors.length > 0 || !isValidNationCode) {
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

  async saveWallet(user: any, body:{ address: string}) {
    if (!body?.address) {
      throw new HttpError("Wallet address is required", 400);
    }
    // 1. Check if user exists
    if (!user || !user.id) {
      throw new HttpError("User not found", 404);
    }
    // 2. Check if address is valid (basic check, can be extended)
    if (typeof body.address !== "string" || body.address.trim() === "") {
      throw new HttpError("Invalid wallet address", 400);
    }
    // 3. Check if user already has a wallet
    const existingWallet = await this.userRepository.findWalletByUserId(user.id);
    if (existingWallet) {
      // If wallet exists, update it
      throw new HttpError("Wallet already saved", 500);
    }
    // 4. Check if address is already used by another user
    const walletByAddress = await this.userRepository.findWalletByAddress(body.address);
    if (walletByAddress && walletByAddress.userId !== user.id) {
      throw new HttpError("Wallet address already used by another user", 409);
    }
    

    // 지갑 저장 (있으면 업데이트, 없으면 생성)
    const wallet = await this.userRepository.upsertWallet(user.id, body.address);
    if (!wallet) {
      throw new HttpError("Failed to save wallet", 500);
    }

    return wallet;
  }
}

// ========================================================
// Exporting an instance of UserService
// ========================================================
export const userService = new UserService(userRepository);