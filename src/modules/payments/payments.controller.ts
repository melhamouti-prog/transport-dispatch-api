import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

@ApiTags("payments")
@Controller({ path: "payments", version: "1" })
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get()
  findAll(@Query() query: PaymentQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: CreatePaymentDto) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdatePaymentDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
