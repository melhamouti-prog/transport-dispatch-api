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
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { InvoiceQueryDto } from "./dto/invoice-query.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";

@ApiTags("invoices")
@Controller({ path: "invoices", version: "1" })
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get()
  findAll(@Query() query: InvoiceQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateInvoiceDto) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateInvoiceDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
