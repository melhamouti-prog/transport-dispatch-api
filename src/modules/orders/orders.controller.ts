import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";

@ApiTags("orders")
@Controller({ path: "orders", version: "1" })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(":id/timeline")
  getTimeline(@Param("id") id: string) {
    return this.ordersService.getTimeline(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateOrderDto) {
    return this.ordersService.update(id, payload);
  }

  @Post(":id/confirm")
  confirm(@Param("id") id: string) {
    return this.ordersService.confirm(id);
  }

  @Post(":id/cancel")
  cancel(@Param("id") id: string, @Body() payload: CancelOrderDto) {
    return this.ordersService.cancel(id, payload);
  }

  @Post(":id/duplicate")
  duplicate(@Param("id") id: string) {
    return this.ordersService.duplicate(id);
  }
}
