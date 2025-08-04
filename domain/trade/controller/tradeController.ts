import { Request, Response } from "express";
import {
  TradeService,
  tradeService,
} from "@/domain/trade/service/tradeService";
import { HttpError } from "@/common/error/errors";
import { CreateTradeDto } from "../dto/createTradeDto";
import { FindTradeDto } from "../dto/findTradeDto";

export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  async createTrade(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      const createTradeDto: CreateTradeDto = req.body;

      const trade = await this.tradeService.createTrade(user, createTradeDto);
      return res.status(201).json(trade);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[createTrade@TradeController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findTrades(req: Request, res: Response): Promise<Response> {
    try {
      const findTradeDto: FindTradeDto = req.query as any;

      const result = await this.tradeService.findTrades(findTradeDto);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[findTrades@TradeController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findTradeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const trade = await this.tradeService.findTradeById(id);
      return res.status(200).json(trade);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[findTradeById@TradeController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findMyTrades(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      const findTradeDto: FindTradeDto = req.query as any;

      const result = await this.tradeService.findMyTrades(user, findTradeDto);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[findMyTrades@TradeController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteTrade(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      const { id } = req.params;

      const result = await this.tradeService.deleteTrade(user, id);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("[deleteTrade@TradeController] Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export const tradeController = new TradeController(tradeService);
