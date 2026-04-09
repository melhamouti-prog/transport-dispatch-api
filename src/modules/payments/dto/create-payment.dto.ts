import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  organizationId!: string;

  @ApiProperty()
  @IsUUID()
  invoiceId!: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  amount!: number;

  @ApiPropertyOptional({ example: "EUR" })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: "bank_transfer" })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ example: "2026-04-09" })
  @IsDateString()
  paymentDate!: string;

  @ApiPropertyOptional({ example: "VIR-2026-0001" })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: "received" })
  @IsOptional()
  @IsString()
  status?: string;
}
