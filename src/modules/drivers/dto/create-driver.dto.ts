import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateDriverDto {
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
  userId?: string;

  @ApiPropertyOptional({ example: "DRV-001" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({ example: "Sofia" })
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: "Martin" })
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "active" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  professionalCardNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  professionalCardExpiry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  medicalVisitExpiry?: string;
}
