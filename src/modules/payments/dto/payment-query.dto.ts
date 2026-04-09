import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export class PaymentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
