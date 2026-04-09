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
import { ServiceTypesService } from "./service-types.service";

@ApiTags("service-types")
@Controller({ path: "service-types", version: "1" })
export class ServiceTypesController {
  constructor(private readonly service: ServiceTypesService) {}

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: Record<string, unknown>) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: Record<string, unknown>) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
