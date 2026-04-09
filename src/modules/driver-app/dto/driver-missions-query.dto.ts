import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class DriverMissionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({ example: "2026-04-09" })
  @IsOptional()
  @IsDateString()
  date?: string;
}
