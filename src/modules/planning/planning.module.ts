import { Module } from "@nestjs/common";
import { OrdersModule } from "../orders/orders.module";
import { MissionsModule } from "../missions/missions.module";
import { PlanningController } from "./planning.controller";
import { PlanningService } from "./planning.service";

@Module({
  imports: [OrdersModule, MissionsModule],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports: [PlanningService],
})
export class PlanningModule {}
