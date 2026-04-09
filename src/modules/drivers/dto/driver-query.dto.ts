import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export class DriverQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
