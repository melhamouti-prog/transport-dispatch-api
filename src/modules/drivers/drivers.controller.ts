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
import { DriversService } from "./drivers.service";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { DriverQueryDto } from "./dto/driver-query.dto";
import { UpdateDriverDto } from "./dto/update-driver.dto";

@ApiTags("drivers")
@Controller({ path: "drivers", version: "1" })
export class DriversController {
  constructor(private readonly service: DriversService) {}

  @Get()
  findAll(@Query() query: DriverQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateDriverDto) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateDriverDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
