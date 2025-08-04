import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
  IsArray,
} from "class-validator";
import { Transform, Type } from "class-transformer";

export enum TradeType {
  BUY = "BUY",
  SELL = "SELL",
}

export enum TradeStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum TradeSortField {
  CREATED_AT = "createdAt",
  PRICE = "price",
  MIN_AMOUNT = "minAmount",
  MAX_AMOUNT = "maxAmount",
}

export class FindTradeDto {
  // ========================================================
  // 필터링 옵션들
  // ========================================================

  @IsEnum(TradeType)
  @IsOptional()
  type?: TradeType[];

  @IsString()
  @IsOptional()
  baseSymbol?: string;

  @IsString()
  @IsOptional()
  quoteSymbol?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceMax?: number;

  @IsEnum(TradeStatus)
  @IsOptional()
  status?: TradeStatus[];

  @IsString()
  @IsOptional()
  userId?: string;

  // ========================================================
  // 페이지네이션
  // ========================================================

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  // ========================================================
  // 정렬
  // ========================================================

  @IsEnum(TradeSortField)
  @IsOptional()
  sortBy?: TradeSortField = TradeSortField.CREATED_AT;

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

  // ========================================================
  // 기타 옵션
  // ========================================================

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  includeUser?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  includeHistory?: boolean = false;
}
