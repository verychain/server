import { IsString, IsNumber, IsOptional, Min } from "class-validator";

export class CreateTradeHistoryDto {
  @IsString()
  buyerId: string;

  @IsString()
  sellerId: string;

  @IsNumber()
  @Min(0)
  fixedAmount: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNumber()
  @Min(0)
  fee: number;

  @IsOptional()
  @IsString()
  txHash?: string;
}
