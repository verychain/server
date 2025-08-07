import { Router } from "express";
import { tradeController } from "@/domain/trade/controller/tradeController";
import { authMiddleware } from "@/common/middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Trade:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *       properties:
 *         title:
 *           type: string
 *           description: 거래 제목
 *         description:
 *           type: string
 *           description: 거래 설명
 *         price:
 *           type: number
 *           description: 거래 가격
 *         category:
 *           type: string
 *           description: 거래 카테고리
 *     TradeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /trade:
 *   post:
 *     summary: 거래 생성
 *     tags: [Trade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trade'
 *     responses:
 *       201:
 *         description: 거래 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TradeResponse'
 *       401:
 *         description: 인증 필요
 */
router.post(
  "/",
  authMiddleware,
  tradeController.createTrade.bind(tradeController)
);

/**
 * @swagger
 * /trade:
 *   get:
 *     summary: 모든 거래 조회
 *     tags: [Trade]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 거래 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trades:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TradeResponse'
 *                 total:
 *                   type: integer
 */
router.get("/", tradeController.findTrades.bind(tradeController));

/**
 * @swagger
 * /trade/{id}:
 *   get:
 *     summary: 특정 거래 조회
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 거래 ID
 *     responses:
 *       200:
 *         description: 거래 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TradeResponse'
 *       404:
 *         description: 거래를 찾을 수 없음
 */
router.get("/:id", tradeController.findTradeById.bind(tradeController));

/**
 * @swagger
 * /trade/my/trades:
 *   get:
 *     summary: 내 거래 목록 조회
 *     tags: [Trade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 내 거래 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trades:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TradeResponse'
 *                 total:
 *                   type: integer
 *       401:
 *         description: 인증 필요
 */
router.get(
  "/my/trades",
  authMiddleware,
  tradeController.findMyTrades.bind(tradeController)
);

/**
 * @swagger
 * /trade/{id}:
 *   delete:
 *     summary: 거래 삭제
 *     tags: [Trade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 거래 ID
 *     responses:
 *       200:
 *         description: 거래 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 거래를 찾을 수 없음
 */
router.delete(
  "/:id",
  authMiddleware,
  tradeController.deleteTrade.bind(tradeController)
);

export default router;
