import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class ChangeMissionStatusDto {
  @ApiProperty({ example: "driver_assigned" })
  @IsString()
  status!: string;

  @ApiPropertyOptional({ example: "Affectation validée par le dispatch" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
