import { Router } from "express";
import { userController } from "@/domain/user/controller/userController";
import { authMiddleware } from "@/common/middleware/authMiddleware";

const router = Router();

// 라우트 작성
router.post("/signup", userController.signup.bind(userController));
router.post("/signin", userController.signin.bind(userController));
router.get("/profile", authMiddleware, userController.getProfile.bind(userController));
router.put("/profile", authMiddleware, userController.updateProfile.bind(userController));
router.delete("/profile", authMiddleware, userController.deleteProfile.bind(userController));

export default router;
