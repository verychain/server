// docs/annotations/schemas.ts
/**
 * @swagger
 * components:
 *   schemas:
 *     TradeType:
 *       type: string
 *       enum: [BUY, SELL]
 *       description: 거래 타입
 *     TradeStatus:
 *       type: string
 *       enum: [ACTIVE, PENDING, COMPLETED, CANCELLED, EXPIRED]
 *       description: 거래 상태
 *     TradeOption:
 *       type: string
 *       enum: [BANK_TRANSFER]
 *       description: 거래 옵션
 *     SortOrder:
 *       type: string
 *       enum: [asc, desc]
 *       description: 정렬 순서
 *     TradeSortField:
 *       type: string
 *       enum: [createdAt, price, minAmount, maxAmount]
 *       description: 정렬 필드
 *     CreateTradeDto:
 *       type: object
 *       required:
 *         - type
 *         - baseSymbol
 *         - quoteSymbol
 *         - minAmount
 *         - maxAmount
 *         - price
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/TradeType'
 *           description: 거래 타입 (BUY/SELL)
 *         baseSymbol:
 *           type: string
 *           description: 기준 통화 (ex. VERY)
 *           example: "VERY"
 *         quoteSymbol:
 *           type: string
 *           description: 쿼트 통화 (ex. KRW, USDT)
 *           example: "KRW"
 *         minAmount:
 *           type: number
 *           minimum: 0
 *           description: 최소 거래량
 *           example: 10.0
 *         maxAmount:
 *           type: number
 *           minimum: 0
 *           description: 최대 거래량
 *           example: 1000.0
 *         price:
 *           type: number
 *           minimum: 0
 *           description: 1개당 가격
 *           example: 1000.0
 *         option:
 *           $ref: '#/components/schemas/TradeOption'
 *           description: 거래 옵션
 *           default: BANK_TRANSFER
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: 만료일
 *           example: "2024-12-31T23:59:59Z"
 *     FindTradeDto:
 *       type: object
 *       properties:
 *         type:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeType'
 *           description: 거래 타입 필터 (배열)
 *         baseSymbol:
 *           type: string
 *           description: 기준 통화 필터
 *         quoteSymbol:
 *           type: string
 *           description: 쿼트 통화 필터
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: 거래량 필터 (minAmount <= amount <= maxAmount)
 *         priceMin:
 *           type: number
 *           minimum: 0
 *           description: 최소 가격 필터
 *         priceMax:
 *           type: number
 *           minimum: 0
 *           description: 최대 가격 필터
 *         status:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeStatus'
 *           description: 거래 상태 필터 (배열)
 *         userId:
 *           type: string
 *           description: 사용자 ID 필터
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: 페이지 번호
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *           description: 페이지당 항목 수
 *         sortBy:
 *           $ref: '#/components/schemas/TradeSortField'
 *           default: createdAt
 *           description: 정렬 필드
 *         sortOrder:
 *           $ref: '#/components/schemas/SortOrder'
 *           default: desc
 *           description: 정렬 순서
 *         includeUser:
 *           type: boolean
 *           default: false
 *           description: 사용자 정보 포함 여부
 *         includeHistory:
 *           type: boolean
 *           default: false
 *           description: 거래 히스토리 포함 여부
 *     Trade:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 거래 ID
 *         userId:
 *           type: string
 *           description: 사용자 ID
 *         type:
 *           $ref: '#/components/schemas/TradeType'
 *         baseSymbol:
 *           type: string
 *         quoteSymbol:
 *           type: string
 *         minAmount:
 *           type: number
 *         maxAmount:
 *           type: number
 *         price:
 *           type: number
 *         option:
 *           $ref: '#/components/schemas/TradeOption'
 *         status:
 *           $ref: '#/components/schemas/TradeStatus'
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *             nickname:
 *               type: string
 *             grade:
 *               type: string
 *               enum: [BRONZE, SILVER, GOLD, PLATINUM]
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: 현재 페이지
 *         limit:
 *           type: integer
 *           description: 페이지당 항목 수
 *         total:
 *           type: integer
 *           description: 전체 항목 수
 *         totalPages:
 *           type: integer
 *           description: 전체 페이지 수
 *         hasNext:
 *           type: boolean
 *           description: 다음 페이지 존재 여부
 *         hasPrev:
 *           type: boolean
 *           description: 이전 페이지 존재 여부
 *     TradeListResponse:
 *       type: object
 *       properties:
 *         trades:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Trade'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationInfo'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: 에러 메시지
 */
