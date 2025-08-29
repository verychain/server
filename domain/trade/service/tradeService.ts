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
import { sendToUser } from "@/common/utils/wsMessegeSender";

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
      if (trade.status !== (TradeStatus.ACTIVE as number))
        throw new HttpError("Trade is not available", 400);

      // 4. 거래 수량 확인
      if (trade.minAmount > request.amount || trade.maxAmount < request.amount)
        throw new HttpError("Amount is out of range", 400);

      // 5. TradeHistory 생성
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

      // 6. Trade 상태를 PENDING 으로 변경
      await this.tradeRepository.updateTradeStatus(
        tradeId,
        TradeStatus.PENDING
      );

      // 7. 소켓 알림 (거래 생성자에게)
      sendToUser(trade.userId.toString(), "TRADE_REQUESTED", {
        message: `${user.nickname}님이 거래에 참여했습니다.`,
      });

      return tradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[requestTrade@TradeService] Error:", error);
      throw new HttpError("Failed to request trade", 500);
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

      // 5. 블록체인 이벤트 조회 (TODO : test)
      const isValidDeposit = await this.chainService.verifyTokenDeposit(
        trade.id,
        request.txHash,
        Number(tradeHistory.fixedAmount),
        Number(tradeHistory.fee)
      );
      // const isValidDeposit = true;

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

      // 7. 소켓 알림 (구매자에게)
      sendToUser(tradeHistory.buyerId.toString(), "TOKEN_DEPOSITED", {
        message: `${tradeHistory.sellerId}님이 ${trade.baseSymbol}을/를 예치하였습니다. 원화 송금을 진행해주세요.`,
      });

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[depositToken@TradeService] Error:", error);
      throw new HttpError("Failed to deposit token", 500);
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

      // 6. 소켓 알림 (판매자에게)
      sendToUser(tradeHistory.sellerId.toString(), "PAYMENT_CONFIRMED", {
        message: `${tradeHistory.buyerId}님이 원화를 송금하였습니다. 확인 후 진행해주세요.`,
      });

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[confirmPayment@TradeService] Error:", error);
      throw new HttpError("Failed to confirm payment", 500);
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
      const txHash = await this.chainService.transferToBuyer(
        trade.id,
        tradeHistory.sellerId,
        tradeHistory.buyerId
      );

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

      // 8. Trade 상태 업데이트
      await this.tradeRepository.updateTradeStatus(
        tradeId,
        TradeStatus.COMPLETED
      );

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[completeTrade@TradeService] Error:", error);
      throw new HttpError("Failed to complete trade", 500);
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
      let txHash: string | undefined;
      if (tradeHistory.status >= TradeHistoryStatus.TOKEN_DEPOSITED) {
        // 판매자의 토큰을 다시 반환
        txHash = await this.chainService.refundToSeller(
          trade.id,
          tradeHistory.sellerId
        );
      }

      // 6. TradeHistory 상태 업데이트
      const updatedTradeHistory =
        await this.tradeRepository.updateTradeHistoryStatus(
          tradeHistory.id,
          TradeHistoryStatus.CANCELLED,
          txHash
        );

      // 7. 소켓 알림 (양쪽 다)
      sendToUser(tradeHistory.sellerId.toString(), "TRADE_CANCELLED", {
        message: `거래가 취소되었습니다.`,
      });
      sendToUser(tradeHistory.buyerId.toString(), "TRADE_CANCELLED", {
        message: `거래가 취소되었습니다.`,
      });

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[cancelTrade@TradeService] Error:", error);
      throw new HttpError("Failed to cancel trade", 500);
    }
  }

  async failTrade(user: User, tradeId: number) {
    try {
      // 1. 거래 존재 확인
      const trade = await this.tradeRepository.findTradeById(tradeId);
      if (!trade) throw new HttpError("Trade not found", 404);

      // 2. TradeHistory 존재 확인
      const tradeHistory = await this.tradeRepository.findTradeHistoryByTradeId(
        tradeId
      );
      if (!tradeHistory) throw new HttpError("Trade history not found", 404);

      // 3. 현재 상태 확인 (완료된 거래는 실패 불가)
      if (tradeHistory.status === TradeHistoryStatus.COMPLETED) {
        throw new HttpError("Cannot fail completed trade", 400);
      }

      // 4. TradeHistory 상태 업데이트
      const updatedTradeHistory =
        await this.tradeRepository.updateTradeHistoryStatus(
          tradeHistory.id,
          TradeHistoryStatus.FAILED
        );

      // 5. 소켓 알림 (양쪽 다)
      sendToUser(tradeHistory.sellerId.toString(), "TRADE_FAILED", {
        message: `거래시간 만료로 인하여 거래가 실패하였습니다.`,
      });
      sendToUser(tradeHistory.buyerId.toString(), "TRADE_FAILED", {
        message: `거래시간 만료로 인하여 거래가 실패하였습니다.`,
      });

      return updatedTradeHistory;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("[failTrade@TradeService] Error:", error);
      throw new HttpError("Failed to process trade failure", 500);
    }
  }
}

export const tradeService = new TradeService(tradeRepository, chainService);
