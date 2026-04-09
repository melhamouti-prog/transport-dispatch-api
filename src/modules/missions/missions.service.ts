import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AssignMissionDto } from "./dto/assign-mission.dto";
import { ChangeMissionStatusDto } from "./dto/change-mission-status.dto";
import { CreateMissionDto } from "./dto/create-mission.dto";
import { MissionQueryDto } from "./dto/mission-query.dto";
import { UpdateMissionDto } from "./dto/update-mission.dto";
import { MissionStateMachineService } from "./mission-state-machine.service";

@Injectable()
export class MissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly missionStateMachine: MissionStateMachineService,
  ) {}

  async findAll(query: MissionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.mission.count({ where }),
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
              clientId: true,
            },
          },
        },
        orderBy: { pickupAt: "asc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: true,
      },
    });

    if (!mission) {
      throw new NotFoundException(`Mission ${id} introuvable`);
    }

    return mission;
  }

  async create(payload: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        organizationId: payload.organizationId,
        orderId: payload.orderId,
        label: payload.label,
        pickupAt: new Date(payload.pickupAt),
        status: payload.status ?? "draft",
        serviceTypeId: payload.serviceTypeId,
        passengerCount: payload.passengerCount,
        luggageCount: payload.luggageCount,
        estimatedDistanceKm: payload.estimatedDistanceKm,
        estimatedPrice: payload.estimatedPrice,
        notes: payload.notes,
        stops: {
          create: payload.stops.map((stop, index) => ({
            sequence: index + 1,
            type: stop.type,
            scheduledAt: new Date(stop.scheduledAt),
            address: stop.address,
            note: stop.note,
          })),
        },
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
      },
    });
  }

  async update(id: string, payload: UpdateMissionDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      if (payload.stops) {
        await tx.missionStop.deleteMany({ where: { missionId: id } });
      }

      return tx.mission.update({
        where: { id },
        data: {
          organizationId: payload.organizationId,
          orderId: payload.orderId,
          label: payload.label,
          pickupAt: payload.pickupAt ? new Date(payload.pickupAt) : undefined,
          status: payload.status,
          serviceTypeId: payload.serviceTypeId,
          passengerCount: payload.passengerCount,
          luggageCount: payload.luggageCount,
          estimatedDistanceKm: payload.estimatedDistanceKm,
          estimatedPrice: payload.estimatedPrice,
          notes: payload.notes,
          stops: payload.stops
            ? {
                create: payload.stops.map((stop, index) => ({
                  sequence: index + 1,
                  type: stop.type,
                  scheduledAt: new Date(stop.scheduledAt),
                  address: stop.address,
                  note: stop.note,
                })),
              }
            : undefined,
        },
        include: {
          stops: { orderBy: { sequence: "asc" } },
          assignment: true,
          order: true,
        },
      });
    });
  }

  async assign(id: string, payload: AssignMissionDto) {
    await this.findOne(id);

    const assignment = await this.prisma.missionAssignment.upsert({
      where: { missionId: id },
      create: {
        missionId: id,
        driverId: payload.driverId,
        vehicleId: payload.vehicleId,
        assignmentMode: payload.assignmentMode ?? "manual_dispatch",
        status: "assigned",
      },
      update: {
        driverId: payload.driverId,
        vehicleId: payload.vehicleId,
        assignmentMode: payload.assignmentMode ?? "manual_dispatch",
        status: "assigned",
        assignedAt: new Date(),
      },
    });

    await this.prisma.mission.update({
      where: { id },
      data: { status: "driver_assigned" },
    });

    return {
      missionId: id,
      assignment,
    };
  }

  async unassign(id: string) {
    await this.findOne(id);

    await this.prisma.$transaction([
      this.prisma.missionAssignment.deleteMany({ where: { missionId: id } }),
      this.prisma.mission.update({
        where: { id },
        data: { status: "confirmed" },
      }),
    ]);

    return {
      missionId: id,
      unassigned: true,
    };
  }

  async duplicate(id: string) {
    const mission = await this.findOne(id);

    return this.prisma.mission.create({
      data: {
        organizationId: mission.organizationId,
        orderId: mission.orderId,
        label: `${mission.label} (copie)`,
        pickupAt: mission.pickupAt,
        status: "draft",
        serviceTypeId: mission.serviceTypeId,
        passengerCount: mission.passengerCount,
        luggageCount: mission.luggageCount,
        estimatedDistanceKm: mission.estimatedDistanceKm,
        estimatedPrice: mission.estimatedPrice,
        notes: mission.notes,
        stops: {
          create: mission.stops.map((stop) => ({
            sequence: stop.sequence,
            type: stop.type,
            scheduledAt: stop.scheduledAt,
            address: stop.address,
            note: stop.note,
          })),
        },
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
      },
    });
  }

  async createReturnMission(id: string) {
    const mission = await this.findOne(id);
    const reversedStops = [...mission.stops].reverse();
    const pickupAt = reversedStops[0]?.scheduledAt ?? mission.pickupAt;

    return this.prisma.mission.create({
      data: {
        organizationId: mission.organizationId,
        orderId: mission.orderId,
        label: `${mission.label} (retour)`,
        pickupAt,
        status: "draft",
        serviceTypeId: mission.serviceTypeId,
        passengerCount: mission.passengerCount,
        luggageCount: mission.luggageCount,
        estimatedDistanceKm: mission.estimatedDistanceKm,
        estimatedPrice: mission.estimatedPrice,
        notes: mission.notes,
        stops: {
          create: reversedStops.map((stop, index) => ({
            sequence: index + 1,
            type:
              index === 0
                ? "pickup"
                : index === reversedStops.length - 1
                  ? "dropoff"
                  : "stopover",
            scheduledAt: stop.scheduledAt,
            address: stop.address,
            note: stop.note,
          })),
        },
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
      },
    });
  }

  async changeStatus(id: string, payload: ChangeMissionStatusDto) {
    const mission = await this.findOne(id);
    this.missionStateMachine.assertTransition(mission.status, payload.status);

    return this.prisma.mission.update({
      where: { id },
      data: {
        status: payload.status,
        notes: payload.reason
          ? [mission.notes, payload.reason].filter(Boolean).join(" | ")
          : mission.notes,
      },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: true,
      },
    });
  }

  async getTimeline(id: string) {
    const mission = await this.findOne(id);

    const events = [
      {
        type: "mission.created",
        at: mission.createdAt,
        label: "Mission créée",
      },
      ...(mission.assignment
        ? [
            {
              type: "mission.assigned",
              at: mission.assignment.assignedAt,
              label: `Affectée au chauffeur ${mission.assignment.driverId}`,
            },
          ]
        : []),
      {
        type: `mission.${mission.status}`,
        at: mission.updatedAt,
        label: `Statut actuel: ${mission.status}`,
      },
    ].sort((a, b) => +new Date(a.at) - +new Date(b.at));

    return {
      missionId: mission.id,
      events,
    };
  }

  async recalculateRoute(id: string) {
    const mission = await this.findOne(id);
    const estimatedDistanceKm =
      mission.estimatedDistanceKm ??
      Math.max((mission.stops.length - 1) * 12.5, 0);
    const estimatedDurationMinutes = Math.max(
      (mission.stops.length - 1) * 25,
      0,
    );

    const updated = await this.prisma.mission.update({
      where: { id },
      data: {
        estimatedDistanceKm,
      },
    });

    return {
      missionId: id,
      estimatedDistanceKm: updated.estimatedDistanceKm,
      estimatedDurationMinutes,
    };
  }

  async closeMission(id: string) {
    await this.findOne(id);

    return this.prisma.mission.update({
      where: { id },
      data: { status: "closed" },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        assignment: true,
        order: true,
      },
    });
  }

  private buildWhere(query: MissionQueryDto): Prisma.MissionWhereInput {
    const where: Prisma.MissionWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.orderId) where.orderId = query.orderId;
    if (query.driverId) where.assignment = { is: { driverId: query.driverId } };
    if (query.status) where.status = query.status;

    if (query.fromDate || query.toDate) {
      where.pickupAt = {};
      if (query.fromDate) where.pickupAt.gte = new Date(query.fromDate);
      if (query.toDate) where.pickupAt.lte = new Date(query.toDate);
    }

    if (query.q) {
      where.OR = [
        { label: { contains: query.q, mode: "insensitive" } },
        { notes: { contains: query.q, mode: "insensitive" } },
        {
          stops: {
            some: {
              address: { contains: query.q, mode: "insensitive" },
            },
          },
        },
      ];
    }

    return where;
  }
}
