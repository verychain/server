import { Router } from "express";
import { UserController } from "@/domain/user/controller/userController";

const router = Router();
const userController = new UserController();

// 라우트 작성

export default router;
