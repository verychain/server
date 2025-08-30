import { IsString, IsNumber, Min } from "class-validator";

export class CreatePriceHistoryDto {
  @IsString()
  baseSymbol: string;

  @IsString()
  quoteSymbol: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  amount: number;
}
