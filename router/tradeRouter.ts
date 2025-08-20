import { Router } from "express";
import { tradeController } from "@/domain/trade/controller/tradeController";
import { authMiddleware } from "@/common/middleware/authMiddleware";

const router = Router();

// 거래 생성
router.post(
  "/",
  authMiddleware,
  tradeController.createTrade.bind(tradeController)
);
// 모든 거래 조회
router.get("/", tradeController.findTrades.bind(tradeController));
// 특정 거래 조회
router.get("/:id", tradeController.findTradeById.bind(tradeController));
// 내 거래 조회
router.get(
  "/my/trades",
  authMiddleware,
  tradeController.findMyTrades.bind(tradeController)
);
// 거래 삭제
router.delete(
  "/:id",
  authMiddleware,
  tradeController.deleteTrade.bind(tradeController)
);

// 거래 요청
router.post(
  "/:id/request",
  authMiddleware,
  tradeController.requestTrade.bind(tradeController)
);
// 토큰 예치 (판매자 실행)
router.post(
  "/:id/deposit",
  authMiddleware,
  tradeController.despositToken.bind(tradeController)
);
// 원화 입금 완료 (구매자 실행)
router.post(
  "/:id/confirm",
  authMiddleware,
  tradeController.confirmPayment.bind(tradeController)
);
// 원화 입금 확인 (판매자 실행)
router.post(
  "/:id/complete",
  authMiddleware,
  tradeController.completeTrade.bind(tradeController)
);
// 거래 취소
router.post(
  "/:id/cancel",
  authMiddleware,
  tradeController.cancelTrade.bind(tradeController)
);

export default router;
