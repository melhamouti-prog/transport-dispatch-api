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
import { FilesService } from "./files.service";

@ApiTags("files")
@Controller({ path: "files", version: "1" })
export class FilesController {
  constructor(private readonly service: FilesService) {}

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
