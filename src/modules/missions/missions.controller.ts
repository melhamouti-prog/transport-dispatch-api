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
import { MissionsService } from "./missions.service";
import { CreateMissionDto } from "./dto/create-mission.dto";
import { UpdateMissionDto } from "./dto/update-mission.dto";
import { AssignMissionDto } from "./dto/assign-mission.dto";
import { ChangeMissionStatusDto } from "./dto/change-mission-status.dto";
import { MissionQueryDto } from "./dto/mission-query.dto";

@ApiTags("missions")
@Controller({ path: "missions", version: "1" })
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  findAll(@Query() query: MissionQueryDto) {
    return this.missionsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.missionsService.findOne(id);
  }

  @Get(":id/timeline")
  timeline(@Param("id") id: string) {
    return this.missionsService.getTimeline(id);
  }

  @Post()
  create(@Body() payload: CreateMissionDto) {
    return this.missionsService.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateMissionDto) {
    return this.missionsService.update(id, payload);
  }

  @Post(":id/assign")
  assign(@Param("id") id: string, @Body() payload: AssignMissionDto) {
    return this.missionsService.assign(id, payload);
  }

  @Post(":id/unassign")
  unassign(@Param("id") id: string) {
    return this.missionsService.unassign(id);
  }

  @Post(":id/duplicate")
  duplicate(@Param("id") id: string) {
    return this.missionsService.duplicate(id);
  }

  @Post(":id/return")
  createReturnMission(@Param("id") id: string) {
    return this.missionsService.createReturnMission(id);
  }

  @Post(":id/status")
  changeStatus(
    @Param("id") id: string,
    @Body() payload: ChangeMissionStatusDto,
  ) {
    return this.missionsService.changeStatus(id, payload);
  }

  @Post(":id/recalculate-route")
  recalculateRoute(@Param("id") id: string) {
    return this.missionsService.recalculateRoute(id);
  }

  @Post(":id/close")
  close(@Param("id") id: string) {
    return this.missionsService.closeMission(id);
  }
}
