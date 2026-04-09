import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class MovePlanningItemDto {
  @ApiProperty()
  @IsUUID()
  missionId!: string;

  @ApiProperty({ example: "2026-04-09T10:00:00.000Z" })
  @IsDateString()
  newPickupAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vehicleId?: string;
}
