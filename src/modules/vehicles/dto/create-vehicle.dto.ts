import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateVehicleDto {
  @ApiProperty()
  @IsUUID()
  organizationId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: "AA-123-BB" })
  @IsString()
  @MaxLength(50)
  registrationNumber!: string;

  @ApiPropertyOptional({ example: "Mercedes Classe E #1" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  luggageCount?: number;

  @ApiPropertyOptional({ example: "active" })
  @IsOptional()
  @IsString()
  status?: string;
}
