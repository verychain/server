import { HttpError } from "@/common/error/errors";
import {
  ChainService,
  chainService,
} from "@/domain/chain/service/chainService";
import {
  TradeRepository,
  tradeRepository,
} from "../repository/tradeRepository";
import { CreateTradeDto } from "../dto/createTradeDto";
import { FindTradeDto } from "../dto/findTradeDto";
import { User } from "@prisma/client";
import { TradeType, TradeStatus, TradeHistoryStatus } from "../dto/enumType";

export class TradeService {
  constructor(
    private readonly tradeRepository: TradeRepository,
    private readonly chainService: ChainService
  ) {}

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

  async findTradeById(id: number) {
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

  async deleteTrade(user: User, tradeId: number) {
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

  // -------------------------------

  async requestTrade(user: User, tradeId: number, request: any) {
    try {
      // 1. 거래 존재 확인
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) throw new HttpError("Trade not found", 404);

      // 2. 자신의 거래인지
      if (trade.userId === user.id)
        throw new HttpError("Cannot request your own trade", 400);

      // 3. 거래 상태
      if (trade.status !== TradeStatus.ACTIVE as number)
        throw new HttpError("Trade is not available", 400);

      // 4. TradeHistory 생성
      const tradeHistory = await this.tradeRepository.createTradeHistory(
        tradeId,
        {
          buyerId: trade.type === TradeType.BUY ? trade.userId : user.id,
          sellerId: trade.type === TradeType.BUY ? user.id : trade.userId,
          fixedAmount: request.amount,
          totalPrice: request.amount * Number(trade.price),
          fee: request.fee,
        }
      );

      // 5. Trade 상태를 PENDING 으로 변경
      await this.tradeRepository.updateTradeStatus(
        tradeId,
        TradeStatus.PENDING
      );

      return tradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[requestTrade@TradeService] Error:", error);
      throw new HttpError("Failed to delete trade", 500);
    }
  }

  async depositToken(user: User, tradeId: number, request: any) {
    try {
      // 1. 거래 존재 확인
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) throw new HttpError("Trade not found", 404);

      // 2. TradeHistory 존재 확인
      const tradeHistory = await this.tradeRepository.findTradeHistoryByTradeId(
        tradeId
      );
      if (!tradeHistory) throw new HttpError("Trade history not found", 404);

      // 3. 판매자만 토큰 예치 가능
      if (tradeHistory.sellerId !== user.id) {
        throw new HttpError("Only seller can deposit tokens", 403);
      }

      // 4. 현재 상태 확인
      if (tradeHistory.status !== TradeHistoryStatus.INITIATED) {
        throw new HttpError("Invalid trade status", 400);
      }

      // 5. 블록체인 이벤트 조회
      const isValidDeposit = await this.chainService.verifyTokenDeposit(
        request.txHash,
        Number(tradeHistory.fixedAmount),
        Number(tradeHistory.fee)
      );

      if (!isValidDeposit) {
        throw new HttpError("Invalid token deposit amount", 400);
      }

      // 6. TradeHistory 상태 업데이트
      const updatedTradeHistory =
        await this.tradeRepository.updateTradeHistoryStatus(
          tradeHistory.id,
          TradeHistoryStatus.TOKEN_DEPOSITED,
          request.txHash
        );

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[depositToken@TradeService] Error:", error);
      throw new HttpError("Failed to delete trade", 500);
    }
  }

  async confirmPayment(user: User, tradeId: number) {
    try {
      // 1. 거래 존재 확인
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) throw new HttpError("Trade not found", 404);

      // 2. TradeHistory 존재 확인
      const tradeHistory = await this.tradeRepository.findTradeHistoryByTradeId(
        tradeId
      );
      if (!tradeHistory) throw new HttpError("Trade history not found", 404);

      // 3. 구매자만 컨펌 가능
      if (tradeHistory.buyerId !== user.id) {
        throw new HttpError("Only buyer can confirm", 403);
      }

      // 4. 현재 상태 확인
      if (tradeHistory.status !== TradeHistoryStatus.TOKEN_DEPOSITED) {
        throw new HttpError("Invalid trade status", 400);
      }

      // 5. TradeHistory 상태 업데이트
      const updatedTradeHistory =
        await this.tradeRepository.updateTradeHistoryStatus(
          tradeHistory.id,
          TradeHistoryStatus.PAYMENT_CONFIRMED
        );

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[confirmPayment@TradeService] Error:", error);
      throw new HttpError("Failed to delete trade", 500);
    }
  }

  async completeTrade(user: User, tradeId: number) {
    try {
      // 1. 거래 존재 확인
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) throw new HttpError("Trade not found", 404);

      // 2. TradeHistory 존재 확인
      const tradeHistory = await this.tradeRepository.findTradeHistoryByTradeId(
        tradeId
      );
      if (!tradeHistory) throw new HttpError("Trade history not found", 404);

      // 3. 판매자만 컨펌 가능
      if (tradeHistory.sellerId !== user.id) {
        throw new HttpError("Only seller can confirm", 403);
      }

      // 4. 현재 상태 확인
      if (tradeHistory.status !== TradeHistoryStatus.PAYMENT_CONFIRMED) {
        throw new HttpError("Invalid trade status", 400);
      }

      // 5. 블록체인
      // TODO: 컨트랙트에서 구매자에게 토큰 송금
      const txHash = await this.chainService.transferToBuyer();

      // 6. TradeHistory 상태 업데이트
      const updatedTradeHistory =
        await this.tradeRepository.updateTradeHistoryStatus(
          tradeHistory.id,
          TradeHistoryStatus.COMPLETED,
          txHash
        );

      // 7. PriceHistory 생성
      await this.tradeRepository.createPriceHistory(tradeId, {
        baseSymbol: trade.baseSymbol,
        quoteSymbol: trade.quoteSymbol,
        price: Number(trade.price),
        amount: Number(tradeHistory.fixedAmount),
      });

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[completeTrade@TradeService] Error:", error);
      throw new HttpError("Failed to delete trade", 500);
    }
  }

  async cancelTrade(user: User, tradeId: number) {
    try {
      // 1. 거래 존재 확인
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) throw new HttpError("Trade not found", 404);

      // 2. TradeHistory 존재 확인
      const tradeHistory = await this.tradeRepository.findTradeHistoryByTradeId(
        tradeId
      );
      if (!tradeHistory) throw new HttpError("Trade history not found", 404);

      // 3. 권한 확인 (거래 생성자 또는 참여자만 취소 가능)
      if (
        tradeHistory.buyerId !== user.id &&
        tradeHistory.sellerId !== user.id
      ) {
        throw new HttpError("Unauthorized to cancel this trade", 403);
      }

      // 4. 현재 상태 확인 (원화 입금 전까지만 가능)
      if (tradeHistory.status >= TradeHistoryStatus.PAYMENT_CONFIRMED) {
        throw new HttpError("Invalid trade status", 400);
      }

      // 5. 토큰이 deposit된 상태라면 토큰 반환
      if (tradeHistory.status >= TradeHistoryStatus.TOKEN_DEPOSITED) {
        // 판매자의 토큰을 다시 반환
        await this.chainService.refundToSeller(
          tradeHistory.sellerId,
          Number(tradeHistory.fixedAmount),
          trade.baseSymbol
        );
      }

      // 6. TradeHistory 상태 업데이트
      const updatedTradeHistory =
        await this.tradeRepository.updateTradeHistoryStatus(
          tradeHistory.id,
          TradeHistoryStatus.CANCELLED
        );

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[cancelTrade@TradeService] Error:", error);
      throw new HttpError("Failed to delete trade", 500);
    }
  }
}

export const tradeService = new TradeService(tradeRepository, chainService);
