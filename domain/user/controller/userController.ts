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

  async signin(req: Request, res: Response): Promise<Response> {
    try {
      const token = await this.userService.signIn(req.body);
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[signin@UserController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      /**
       * TODO:
       * Now, return full user object.
       * ex)
       * {
       *     "id": "cmdl1e58f0000h00x0dka77lp",
       *     "username": "heliotrop1024@gmail.com",
       *     "password": "$2b$10$B58.eIoMAPQQhV0zwTbZwuMBESAMesNJlfmESGlHMIaS2wOhzNI66",
       *     "nickname": "gryu",
       *     "nation": "korea",
       *     "phone": "01050084921",
       *     "grade": "BRONZE",
       *     "role": "USER",
       *     "createdAt": "2025-07-27T02:05:09.760Z",
       *     "updatedAt": "2025-07-27T02:05:09.760Z",
       *     "deletedAt": null
       * }
       * But, we should return only necessary information.
       */
      const user = req.user;
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[getProfile@UserController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      await this.userService.updateProfile(req.user, req.body);
      return res.status(200).json();
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[updateProfile@UserController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteProfile(req: Request, res: Response): Promise<Response> {
    try {
      await this.userService.deleteProfile(req.user);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[deleteProfile@UserController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

// ========================================================
// Exporting an instance of UserController
// ========================================================
export const userController = new UserController(userService);