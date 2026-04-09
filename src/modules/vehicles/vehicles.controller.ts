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
import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleQueryDto } from "./dto/vehicle-query.dto";

@ApiTags("vehicles")
@Controller({ path: "vehicles", version: "1" })
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Get()
  findAll(@Query() query: VehicleQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateVehicleDto) {
    return this.service.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateVehicleDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
