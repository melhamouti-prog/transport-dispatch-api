import { Module } from "@nestjs/common";
import { MissionsController } from "./missions.controller";
import { MissionsService } from "./missions.service";
import { MissionStateMachineService } from "./mission-state-machine.service";

@Module({
  controllers: [MissionsController],
  providers: [MissionsService, MissionStateMachineService],
  exports: [MissionsService, MissionStateMachineService],
})
export class MissionsModule {}
