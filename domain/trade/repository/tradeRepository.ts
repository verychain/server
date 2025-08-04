import { PrismaClient } from "@prisma/client";
import { CreateTradeDto } from "../dto/createTradeDto";
import { FindTradeDto } from "../dto/findTradeDto";

export class TradeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findTradeById(id: string) {
    return await this.prisma.trade.findUnique({
      where: { id, deletedAt: null },
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

  async createTrade(userId: string, tradeData: CreateTradeDto) {
    return await this.prisma.trade.create({
      data: { ...tradeData, userId },
    });
  }

  async deleteTrade(id: string) {
    return await this.prisma.trade.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const tradeRepository = new TradeRepository();
