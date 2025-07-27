import { Router } from "express";
import { userController } from "@/domain/user/controller/userController";

const router = Router();

// 라우트 작성
router.post("/signup", userController.signup.bind(userController));

export default router;
