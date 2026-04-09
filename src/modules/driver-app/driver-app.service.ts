import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DriverCheckpointDto } from "./dto/driver-checkpoint.dto";
import { DriverMissionsQueryDto } from "./dto/driver-missions-query.dto";

@Injectable()
export class DriverAppService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayMissions(query: DriverMissionsQueryDto) {
    if (!query.driverId) {
      return {
        items: [],
        meta: { message: "driverId requis pour la version squelette" },
      };
    }

    const baseDate = query.date ? new Date(query.date) : new Date();
    const start = new Date(baseDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(baseDate);
    end.setUTCHours(23, 59, 59, 999);

    const items = await this.prisma.mission.findMany({
      where: {
        pickupAt: { gte: start, lte: end },
        assignment: { is: { driverId: query.driverId } },
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: { select: { id: true, externalReference: true, status: true } },
      },
      orderBy: { pickupAt: "asc" },
    });

    return { items, meta: { count: items.length } };
  }

  async acceptMission(missionId: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
      include: { assignment: true },
    });
    if (!mission)
      throw new NotFoundException(`Mission ${missionId} introuvable`);

    await this.prisma.$transaction([
      this.prisma.mission.update({
        where: { id: missionId },
        data: { status: "driver_accepted" },
      }),
      this.prisma.missionAssignment.updateMany({
        where: { missionId },
        data: { status: "accepted" },
      }),
    ]);

    return this.prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: true,
      },
    });
  }

  async checkpoint(missionId: string, payload: DriverCheckpointDto) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission)
      throw new NotFoundException(`Mission ${missionId} introuvable`);

    return this.prisma.mission.update({
      where: { id: missionId },
      data: {
        status: payload.status,
        notes: payload.note
          ? [mission.notes, payload.note].filter(Boolean).join(" | ")
          : mission.notes,
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: true,
      },
    });
  }
}
