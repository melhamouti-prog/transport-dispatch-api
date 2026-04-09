import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PlanningService } from "./planning.service";
import { PlanningQueryDto } from "./dto/planning-query.dto";
import { BulkAssignDto } from "./dto/bulk-assign.dto";
import { MovePlanningItemDto } from "./dto/move-planning-item.dto";

@ApiTags("planning")
@Controller({ path: "planning", version: "1" })
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get("board")
  getBoard(@Query() query: PlanningQueryDto) {
    return this.planningService.getBoard(query);
  }

  @Get("dispatch-overview")
  getDispatchOverview(@Query() query: PlanningQueryDto) {
    return this.planningService.getDispatchOverview(query);
  }

  @Get("unassigned")
  getUnassigned(@Query() query: PlanningQueryDto) {
    return this.planningService.getUnassigned(query);
  }

  @Get("resources/:resourceType/:resourceId")
  getResourceTimeline(
    @Param("resourceType") resourceType: string,
    @Param("resourceId") resourceId: string,
    @Query() query: PlanningQueryDto,
  ) {
    return this.planningService.getResourceTimeline(
      resourceType,
      resourceId,
      query,
    );
  }

  @Post("bulk-assign")
  bulkAssign(@Body() payload: BulkAssignDto) {
    return this.planningService.bulkAssign(payload);
  }

  @Post("move-item")
  moveItem(@Body() payload: MovePlanningItemDto) {
    return this.planningService.moveItem(payload);
  }
}
