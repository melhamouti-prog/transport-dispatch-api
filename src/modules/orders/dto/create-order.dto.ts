import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderMissionInputDto {
  @ApiProperty({ example: "Transfert aéroport > hôtel" })
  @IsString()
  @MaxLength(180)
  label!: string;

  @ApiProperty({ example: "2026-04-09T09:00:00.000Z" })
  @IsDateString()
  pickupAt!: string;

  @ApiProperty({ example: "Aéroport CDG Terminal 2E" })
  @IsString()
  @MaxLength(255)
  pickupAddress!: string;

  @ApiProperty({ example: "Hôtel InterContinental Paris Le Grand" })
  @IsString()
  @MaxLength(255)
  dropoffAddress!: string;

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

  @ApiPropertyOptional({ example: "Meet & greet VIP" })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: "8e6f0b4f-9370-4a7e-8a92-348b705e5ce1" })
  @IsUUID()
  organizationId!: string;

  @ApiProperty({ example: "d42b45ec-3cfe-4a67-90b0-d8e8081d2d78" })
  @IsUUID()
  clientId!: string;

  @ApiPropertyOptional({ example: "6af19c62-2591-4f79-b1ff-89d545aa8516" })
  @IsOptional()
  @IsUUID()
  legalEntityId?: string;

  @ApiPropertyOptional({ example: "65f2b41c-3f2b-4f96-b638-18cf8ef70dc2" })
  @IsOptional()
  @IsUUID()
  clientContactId?: string;

  @ApiPropertyOptional({ example: "f2a8278b-c22b-484f-a72c-a0ff5d3f7f66" })
  @IsOptional()
  @IsUUID()
  serviceTypeId?: string;

  @ApiPropertyOptional({ example: "phone" })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({ example: "WAY-EXT-2026-0045" })
  @IsOptional()
  @IsString()
  externalReference?: string;

  @ApiPropertyOptional({ example: "need_confirmation" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: "VIP corporate account" })
  @IsOptional()
  @IsString()
  internalNotes?: string;

  @ApiProperty({ type: [CreateOrderMissionInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderMissionInputDto)
  missions!: CreateOrderMissionInputDto[];
}
