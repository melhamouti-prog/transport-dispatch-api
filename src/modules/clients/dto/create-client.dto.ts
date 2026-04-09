import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateClientDto {
  @ApiProperty({ example: "8e6f0b4f-9370-4a7e-8a92-348b705e5ce1" })
  @IsUUID()
  organizationId!: string;

  @ApiPropertyOptional({ example: "CORP-001" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({ example: "Acme Travel" })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "Acme Travel SAS" })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  legalName?: string;

  @ApiPropertyOptional({ example: "ops@acme-travel.fr" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+33-1-80-00-00-00" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: "active" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  paymentTermsDays?: number;

  @ApiPropertyOptional({ example: "Compte corporate premium" })
  @IsOptional()
  @IsString()
  notes?: string;
}
