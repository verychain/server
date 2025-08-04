import { HttpError } from "@/common/error/errors";
import {
  TradeRepository,
  tradeRepository,
} from "../repository/tradeRepository";
import { CreateTradeDto } from "../dto/createTradeDto";
import { FindTradeDto } from "../dto/findTradeDto";
import { User } from "@prisma/client";

export class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async createTrade(user: User, createTradeDto: CreateTradeDto) {
    try {
      if (createTradeDto.minAmount > createTradeDto.maxAmount) {
        throw new HttpError("minAmount must be lower than maxAmount", 400);
      }
      if (createTradeDto.price <= 0) {
        throw new HttpError("Invalid price", 400);
      }

      const trade = await this.tradeRepository.createTrade(
        user.id,
        createTradeDto
      );
      return trade;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[createTrade@TradeService] Error:", error);
      throw new HttpError("Failed to create trade", 500);
    }
  }

  async findTrades(findTradeDto: FindTradeDto) {
    try {
      const result = await this.tradeRepository.findTradesByOptions(
        findTradeDto
      );
      return result;
    } catch (error) {
      console.error("[findTrades@TradeService] Error:", error);
      throw new HttpError("Failed to find trades", 500);
    }
  }

  async findTradeById(id: string) {
    try {
      const trade = await this.tradeRepository.findTradeById(id);
      if (!trade) {
        throw new HttpError("Trade not found", 404);
      }
      return trade;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[findTradeById@TradeService] Error:", error);
      throw new HttpError("Failed to find trade by id", 500);
    }
  }

  async deleteTrade(user: User, tradeId: string) {
    try {
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) {
        throw new HttpError("Trade not found", 404);
      }

      if (trade.userId !== user.id) {
        throw new HttpError(
          "You do not have permission to delete this trade",
          403
        );
      }

      await this.tradeRepository.deleteTrade(tradeId);
      return trade;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[deleteTrade@TradeService] Error:", error);
      throw new HttpError("Failed to delete trade", 500);
    }
  }

  // 사용자의 거래만 조회
  async findMyTrades(user: User, findTradeDto: FindTradeDto) {
    try {
      const result = await this.tradeRepository.findTradesByOptions({
        ...findTradeDto,
        userId: user.id,
      });
      return result;
    } catch (error) {
      console.error("[findMyTrades@TradeService] Error:", error);
      throw new HttpError(
        "Internal server error occurred while finding my trades",
        500
      );
    }
  }
}

export const tradeService = new TradeService(tradeRepository);
