import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from "class-validator";

export enum TradeType {
  BUY = "BUY",
  SELL = "SELL",
}

export enum TradeOption {
  BANK_TRANSFER = "BANK_TRANSFER",
}

export class CreateTradeDto {
  @IsEnum(TradeType)
  type: TradeType;

  @IsString()
  baseSymbol: string;

  @IsString()
  quoteSymbol: string;

  @IsNumber()
  @Min(0)
  minAmount: number;

  @IsNumber()
  @Min(0)
  maxAmount: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(TradeOption)
  @IsOptional()
  option?: TradeOption = TradeOption.BANK_TRANSFER;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
