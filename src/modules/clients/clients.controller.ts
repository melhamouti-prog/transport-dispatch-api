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
import { ClientsService } from "./clients.service";
import { ClientQueryDto } from "./dto/client-query.dto";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@ApiTags("clients")
@Controller({ path: "clients", version: "1" })
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  findAll(@Query() query: ClientQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateClientDto) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateClientDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
