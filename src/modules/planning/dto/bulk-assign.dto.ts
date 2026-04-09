import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsUUID } from "class-validator";

export class BulkAssignDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  missionIds!: string[];

  @ApiProperty()
  @IsUUID()
  driverId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;
}
