import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateMissionStopDto {
  @ApiProperty({ example: "pickup" })
  @IsString()
  type!: string;

  @ApiProperty({ example: "2026-04-09T09:00:00.000Z" })
  @IsDateString()
  scheduledAt!: string;

  @ApiProperty({ example: "Aéroport CDG Terminal 2E" })
  @IsString()
  @MaxLength(255)
  address!: string;

  @ApiPropertyOptional({ example: "Hall arrivées, porte 8" })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateMissionDto {
  @ApiProperty({ example: "5af749bf-3665-44a1-b315-cdb6d1b828d1" })
  @IsUUID()
  organizationId!: string;

  @ApiPropertyOptional({ example: "d02adf14-7bfe-4cde-9c40-1aa760fa22a6" })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty({ example: "aéroport > hôtel" })
  @IsString()
  @MaxLength(180)
  label!: string;

  @ApiProperty({ example: "2026-04-09T09:00:00.000Z" })
  @IsDateString()
  pickupAt!: string;

  @ApiPropertyOptional({ example: "scheduled" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: "4da01d5c-b50f-4f95-a330-4069c7ba373e" })
  @IsOptional()
  @IsUUID()
  serviceTypeId?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  passengerCount?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  luggageCount?: number;

  @ApiPropertyOptional({ example: 58.5 })
  @IsOptional()
  @IsNumber()
  estimatedDistanceKm?: number;

  @ApiPropertyOptional({ example: 95.0 })
  @IsOptional()
  @IsNumber()
  estimatedPrice?: number;

  @ApiProperty({ type: [CreateMissionStopDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMissionStopDto)
  stops!: CreateMissionStopDto[];

  @ApiPropertyOptional({ example: "Bagages volumineux" })
  @IsOptional()
  @IsString()
  notes?: string;
}
