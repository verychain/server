import { Router } from "express";
import { tradeController } from "@/domain/trade/controller/tradeController";
import { authMiddleware } from "@/common/middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  tradeController.createTrade.bind(tradeController)
);
router.get("/", tradeController.findTrades.bind(tradeController));
router.get("/:id", tradeController.findTradeById.bind(tradeController));
router.get(
  "/my/trades",
  authMiddleware,
  tradeController.findMyTrades.bind(tradeController)
);
router.delete(
  "/:id",
  authMiddleware,
  tradeController.deleteTrade.bind(tradeController)
);

export default router;
