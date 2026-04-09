import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CancelOrderDto {
  @ApiProperty({ example: "Annulation client" })
  @IsString()
  @MaxLength(255)
  reason!: string;

  @ApiProperty({ required: false, example: "No-show sur validation finale" })
  @IsOptional()
  @IsString()
  comment?: string;
}
