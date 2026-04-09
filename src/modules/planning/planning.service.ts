import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BulkAssignDto } from "./dto/bulk-assign.dto";
import { MovePlanningItemDto } from "./dto/move-planning-item.dto";
import { PlanningQueryDto } from "./dto/planning-query.dto";

@Injectable()
export class PlanningService {
  constructor(private readonly prisma: PrismaService) {}

  async getBoard(query: PlanningQueryDto) {
    const where = this.buildMissionWhere(query);

    const [missions, totalMissions, unassigned] =
      await this.prisma.$transaction([
        this.prisma.mission.findMany({
          where,
          include: {
            stops: { orderBy: { sequence: "asc" } },
            assignment: true,
            order: {
              select: {
                id: true,
                externalReference: true,
                status: true,
              },
            },
          },
          orderBy: { pickupAt: "asc" },
        }),
        this.prisma.mission.count({ where }),
        this.prisma.mission.count({
          where: {
            ...where,
            assignment: { is: null },
          },
        }),
      ]);

    const resources = Array.from(
      new Map(
        missions
          .filter((mission) => mission.assignment)
          .map((mission) => [
            mission.assignment!.missionId,
            {
              missionId: mission.id,
              driverId: mission.assignment!.driverId,
              vehicleId: mission.assignment!.vehicleId,
            },
          ]),
      ).values(),
    );

    return {
      filters: query,
      view: query.view ?? "day",
      summary: {
        missions: totalMissions,
        unassigned,
        alerts: missions.filter((mission) => mission.status === "cancelled")
          .length,
      },
      resources,
      items: missions,
    };
  }

  async getUnassigned(query: PlanningQueryDto) {
    const where = this.buildMissionWhere(query);

    const items = await this.prisma.mission.findMany({
      where: {
        ...where,
        assignment: { is: null },
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        order: {
          select: {
            id: true,
            externalReference: true,
            status: true,
          },
        },
      },
      orderBy: { pickupAt: "asc" },
    });

    return {
      filters: query,
      items,
    };
  }

  async getResourceTimeline(
    resourceType: string,
    resourceId: string,
    query: PlanningQueryDto,
  ) {
    const where = this.buildMissionWhere(query);
    const assignmentFilter =
      resourceType === "vehicle"
        ? { assignment: { is: { vehicleId: resourceId } } }
        : { assignment: { is: { driverId: resourceId } } };

    const timeline = await this.prisma.mission.findMany({
      where: {
        ...where,
        ...assignmentFilter,
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: {
          select: {
            id: true,
            externalReference: true,
          },
        },
      },
      orderBy: { pickupAt: "asc" },
    });

    return {
      resourceType,
      resourceId,
      filters: query,
      timeline,
    };
  }

  async bulkAssign(payload: BulkAssignDto) {
    const results = await this.prisma.$transaction(
      payload.missionIds.map((missionId) =>
        this.prisma.missionAssignment.upsert({
          where: { missionId },
          create: {
            missionId,
            driverId: payload.driverId,
            vehicleId: payload.vehicleId,
            assignmentMode: "bulk_dispatch",
            status: "assigned",
          },
          update: {
            driverId: payload.driverId,
            vehicleId: payload.vehicleId,
            assignmentMode: "bulk_dispatch",
            status: "assigned",
            assignedAt: new Date(),
          },
        }),
      ),
    );

    await this.prisma.mission.updateMany({
      where: { id: { in: payload.missionIds } },
      data: { status: "driver_assigned" },
    });

    return {
      action: "bulk-assign",
      processed: results.length,
      assignments: results,
    };
  }

  async moveItem(payload: MovePlanningItemDto) {
    const mission = await this.prisma.mission.update({
      where: { id: payload.missionId },
      data: {
        pickupAt: new Date(payload.newPickupAt),
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
      },
    });

    if (payload.driverId || payload.vehicleId) {
      await this.prisma.missionAssignment.upsert({
        where: { missionId: payload.missionId },
        create: {
          missionId: payload.missionId,
          driverId: payload.driverId!,
          vehicleId: payload.vehicleId,
          assignmentMode: "planning_move",
          status: "assigned",
        },
        update: {
          driverId: payload.driverId ?? undefined,
          vehicleId: payload.vehicleId ?? undefined,
          assignmentMode: "planning_move",
          status: "assigned",
          assignedAt: new Date(),
        },
      });
    }

    return {
      action: "move-item",
      mission,
    };
  }

  async getDispatchOverview(query: PlanningQueryDto) {
    const where = this.buildMissionWhere(query);

    const [ordersAwaitingDispatch, missionsToAssign, ongoingMissions] =
      await this.prisma.$transaction([
        this.prisma.order.count({
          where: {
            organizationId: query.organizationId,
            status: { in: ["draft", "confirmed"] },
          },
        }),
        this.prisma.mission.count({
          where: {
            ...where,
            assignment: { is: null },
            status: { in: ["confirmed", "draft"] },
          },
        }),
        this.prisma.mission.count({
          where: {
            ...where,
            status: {
              in: [
                "driver_assigned",
                "driver_accepted",
                "en_route_pickup",
                "arrived_pickup",
                "passenger_onboard",
              ],
            },
          },
        }),
      ]);

    return {
      filters: query,
      kpis: {
        ordersAwaitingDispatch,
        missionsToAssign,
        ongoingMissions,
      },
    };
  }

  private buildMissionWhere(query: PlanningQueryDto) {
    const where: Record<string, unknown> = {};

    if (query.organizationId) where.organizationId = query.organizationId;

    const effectiveFrom = query.fromDate ?? query.date;
    const effectiveTo = query.toDate ?? query.date;

    if (effectiveFrom || effectiveTo) {
      where.pickupAt = {} as Record<string, Date>;
      if (effectiveFrom)
        (where.pickupAt as Record<string, Date>).gte = new Date(effectiveFrom);
      if (effectiveTo)
        (where.pickupAt as Record<string, Date>).lte = new Date(effectiveTo);
    }

    return where;
  }
}
