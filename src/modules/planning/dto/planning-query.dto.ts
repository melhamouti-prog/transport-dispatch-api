import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class PlanningQueryDto {
  @ApiPropertyOptional({ example: "8e6f0b4f-9370-4a7e-8a92-348b705e5ce1" })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({ example: "day", enum: ["day", "week", "resource"] })
  @IsOptional()
  @IsIn(["day", "week", "resource"])
  view?: "day" | "week" | "resource";

  @ApiPropertyOptional({ example: "2026-04-09" })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: "2026-04-07" })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: "2026-04-13" })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ example: "resource:drivers" })
  @IsOptional()
  @IsString()
  groupBy?: string;
}
