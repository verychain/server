import { Request, Response } from "express";
import { UserService, userService } from "@/domain/user/service/userService";
import { HttpError } from "@/common/error/errors";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async signup(req: Request, res: Response): Promise<Response> {
    try {
      await this.userService.signUp(req.body);
      return res.status(201).json({ message: "User created" });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[signup@UserController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error"});
    }
  }
}

// ========================================================
// Exporting an instance of UserController
// ========================================================
export const userController = new UserController(userService);