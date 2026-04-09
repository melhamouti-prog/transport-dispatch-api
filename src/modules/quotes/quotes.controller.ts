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
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { QuoteQueryDto } from "./dto/quote-query.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";

@ApiTags("quotes")
@Controller({ path: "quotes", version: "1" })
export class QuotesController {
  constructor(private readonly service: QuotesService) {}

  @Get()
  findAll(@Query() query: QuoteQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateQuoteDto) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateQuoteDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
