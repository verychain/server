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
import { SortOrder, TradeSortField } from "./enumType";
import { ArrayTransform } from "@/common/utils/arrayTransform";

export class FindTradeDto {
  // ========================================================
  // 필터링 옵션들
  // ========================================================

  @IsNumber({}, { each: true })
  @IsOptional()
  @ArrayTransform()
  type?: number[];

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
  priceMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceMax?: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  @ArrayTransform()
  status?: number[];

  @IsString()
  @IsOptional()
  userId?: number;

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
