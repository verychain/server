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
 *             $ref: '#/components/schemas/CreateTradeDto'
 *     responses:
 *       201:
 *         description: 거래 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trade'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "minAmount must be lower than maxAmount"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /trade:
 *   get:
 *     summary: 거래 목록 조회
 *     tags: [Trade]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeType'
 *         style: form
 *         explode: true
 *         description: 거래 타입 필터 (배열)
 *         example: ["BUY", "SELL"]
 *       - in: query
 *         name: baseSymbol
 *         schema:
 *           type: string
 *         description: 기준 통화 필터
 *         example: "VERY"
 *       - in: query
 *         name: quoteSymbol
 *         schema:
 *           type: string
 *         description: 쿼트 통화 필터
 *         example: "KRW"
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: 거래량 필터
 *         example: 100.0
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: 최소 가격 필터
 *         example: 500.0
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: 최대 가격 필터
 *         example: 2000.0
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeStatus'
 *         style: form
 *         explode: true
 *         description: 거래 상태 필터 (배열)
 *         example: ["ACTIVE", "PENDING"]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: 페이지당 항목 수
 *         example: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           $ref: '#/components/schemas/TradeSortField'
 *           default: createdAt
 *         description: 정렬 필드
 *         example: "createdAt"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           $ref: '#/components/schemas/SortOrder'
 *           default: desc
 *         description: 정렬 순서
 *         example: "desc"
 *       - in: query
 *         name: includeUser
 *         schema:
 *           type: boolean
 *           default: false
 *         description: 사용자 정보 포함 여부
 *         example: false
 *       - in: query
 *         name: includeHistory
 *         schema:
 *           type: boolean
 *           default: false
 *         description: 거래 히스토리 포함 여부
 *         example: false
 *     responses:
 *       200:
 *         description: 거래 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TradeListResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /trade/{id}:
 *   get:
 *     summary: 거래 상세 조회
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
 *         description: 거래 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trade'
 *       404:
 *         description: 거래를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Trade not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
 *         name: type
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeType'
 *         style: form
 *         explode: true
 *         description: 거래 타입 필터 (배열)
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeStatus'
 *         style: form
 *         explode: true
 *         description: 거래 상태 필터 (배열)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: sortBy
 *         schema:
 *           $ref: '#/components/schemas/TradeSortField'
 *           default: createdAt
 *         description: 정렬 필드
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           $ref: '#/components/schemas/SortOrder'
 *           default: desc
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 내 거래 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TradeListResponse'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trade'
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You do not have permission to delete this trade"
 *       404:
 *         description: 거래를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
