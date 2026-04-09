import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DriverCheckpointDto {
  @ApiProperty({ example: "arrived_pickup" })
  @IsString()
  status!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
