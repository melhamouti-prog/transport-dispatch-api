import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class AssignMissionDto {
  @ApiProperty({ example: "a58ee0d8-c64d-4f3a-a0a2-6c34b1786d86" })
  @IsUUID()
  driverId!: string;

  @ApiPropertyOptional({ example: "c3071a7b-8f9e-4036-9147-ef710cc67bb8" })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional({ example: "manual_dispatch" })
  @IsOptional()
  @IsString()
  assignmentMode?: string;
}
