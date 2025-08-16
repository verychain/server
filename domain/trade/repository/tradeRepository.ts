import { PrismaClient } from "@prisma/client";
import { TradeHistoryStatus } from "../dto/enumType";
import { CreateTradeDto } from "../dto/createTradeDto";
import { FindTradeDto } from "../dto/findTradeDto";
import { CreateTradeHistoryDto } from "../dto/createTradeHistory";
import { CreatePriceHistoryDto } from "../dto/createPriceHistory";

export class TradeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findTradeById(id: number) {
    return await this.prisma.trade.findUnique({
      where: { id, deletedAt: null },
      include: { user: true },
    });
  }

  async findTradesByOptions(findTradeDto: FindTradeDto) {
    const {
      type,
      baseSymbol,
      quoteSymbol,
      amount,
      priceMin,
      priceMax,
      status,
      userId,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      includeUser = false,
      includeHistory = false,
    } = findTradeDto;

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 필터 조건
    const where: any = { deletedAt: null };

    // 1. type 필터
    if (type) where.type = { in: type };

    // 2. symbol 필터
    if (baseSymbol) where.baseSymbol = baseSymbol;
    if (quoteSymbol) where.quoteSymbol = quoteSymbol;

    // 3. amount 필터
    if (amount !== undefined) {
      where.AND = [
        { minAmont: { lte: amount } },
        { maxAmount: { gte: amount } },
      ];
    }

    // 4. price 필터
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    // 5. status 필터
    if (status) where.status = { in: status };

    // 6. userId 필터
    if (userId) where.userId = userId;

    // include 옵션
    const include: any = {};
    if (includeUser) include.user = true;
    if (includeHistory) include.history = true;

    // 쿼리 실행
    const [trades, total] = await Promise.all([
      this.prisma.trade.findMany({
        where,
        include,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.trade.count({ where }),
    ]);

    return {
      trades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async createTrade(userId: number, data: CreateTradeDto) {
    return await this.prisma.trade.create({
      data: { ...data, userId },
      include: { user: true },
    });
  }

  async deleteTrade(id: number) {
    return await this.prisma.trade.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: { user: true },
    });
  }

  async updateTradeStatus(id: number, status: number) {
    return await this.prisma.trade.update({
      where: { id },
      data: { status: status },
    });
  }

  // -------------------------------

  async findTradeHistoryByTradeId(tradeId: number) {
    return await this.prisma.tradeHistory.findFirst({
      where: { tradeId, deletedAt: null },
    });
  }

  async createTradeHistory(tradeId: number, data: CreateTradeHistoryDto) {
    return await this.prisma.tradeHistory.create({
      data: { ...data, tradeId },
    });
  }

  async updateTradeHistoryStatus(id: number, status: number, txHash?: string) {
    const updateData: any = { status };

    if (status === TradeHistoryStatus.TOKEN_DEPOSITED) {
      updateData.tokenDepositedAt = new Date();
      updateData.sellerTxHash = txHash;
    }
    if (status === TradeHistoryStatus.PAYMENT_CONFIRMED)
      updateData.paymentConfirmedAt = new Date();
    if (status === TradeHistoryStatus.COMPLETED) {
      updateData.completedAt = new Date();
      updateData.contractTxHash = txHash;
    }
    if (status === TradeHistoryStatus.CANCELLED)
      updateData.cancelledAt = new Date();
    if (status === TradeHistoryStatus.FAILED) updateData.failedAt = new Date();

    return await this.prisma.tradeHistory.update({
      where: { id },
      data: updateData,
    });
  }

  // -------------------------------

  async createPriceHistory(tradeId: number, data: CreatePriceHistoryDto) {
    return await this.prisma.priceHistory.create({
      data: { ...data, tradeId },
    });
  }
}

export const tradeRepository = new TradeRepository();
