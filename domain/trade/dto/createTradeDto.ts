import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from "class-validator";

export class CreateTradeDto {
  // @IsEnum(TradeType)
  @IsNumber()
  type: number;

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

  // @IsEnum(TradeOption)
  @IsNumber()
  @IsOptional()
  option?: number = 0;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
