import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DriverAppService } from "./driver-app.service";
import { DriverCheckpointDto } from "./dto/driver-checkpoint.dto";
import { DriverMissionsQueryDto } from "./dto/driver-missions-query.dto";

@ApiTags("driver-app")
@Controller({ path: "driver-app", version: "1" })
export class DriverAppController {
  constructor(private readonly service: DriverAppService) {}

  @Get("missions/today")
  getTodayMissions(@Query() query: DriverMissionsQueryDto) {
    return this.service.getTodayMissions(query);
  }

  @Post("missions/:missionId/accept")
  acceptMission(@Param("missionId") missionId: string) {
    return this.service.acceptMission(missionId);
  }

  @Post("missions/:missionId/checkpoint")
  checkpoint(
    @Param("missionId") missionId: string,
    @Body() payload: DriverCheckpointDto,
  ) {
    return this.service.checkpoint(missionId, payload);
  }
}
