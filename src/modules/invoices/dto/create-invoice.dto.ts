import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";

export class CreateInvoiceLineDto {
  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  quantity!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  unitPrice!: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  taxRate?: number;
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsUUID()
  organizationId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty()
  @IsUUID()
  clientId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  legalEntityId?: string;

  @ApiProperty({ example: "FAC-2026-001" })
  @IsString()
  number!: string;

  @ApiProperty({ example: "2026-04-09" })
  @IsDateString()
  issueDate!: string;

  @ApiPropertyOptional({ example: "2026-05-09" })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: "draft" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateInvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineDto)
  lines!: CreateInvoiceLineDto[];
}
