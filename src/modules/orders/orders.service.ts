import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: OrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: {
          missions: {
            select: {
              id: true,
              label: true,
              status: true,
              pickupAt: true,
            },
            orderBy: { pickupAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
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
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        missions: {
          include: {
            stops: { orderBy: { sequence: "asc" } },
            assignment: true,
          },
          orderBy: { pickupAt: "asc" },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }

    return order;
  }

  async create(payload: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        organizationId: payload.organizationId,
        clientId: payload.clientId,
        legalEntityId: payload.legalEntityId,
        clientContactId: payload.clientContactId,
        serviceTypeId: payload.serviceTypeId,
        channel: payload.channel,
        externalReference: payload.externalReference,
        status: payload.status ?? "draft",
        internalNotes: payload.internalNotes,
        missions: {
          create: payload.missions.map((mission, index) => ({
            organizationId: payload.organizationId,
            label: mission.label,
            pickupAt: new Date(mission.pickupAt),
            status: "draft",
            serviceTypeId: payload.serviceTypeId,
            passengerCount: mission.passengerCount,
            luggageCount: mission.luggageCount,
            notes: mission.notes,
            stops: {
              create: [
                {
                  sequence: 1,
                  type: "pickup",
                  scheduledAt: new Date(mission.pickupAt),
                  address: mission.pickupAddress,
                },
                {
                  sequence: 2,
                  type: "dropoff",
                  scheduledAt: new Date(mission.pickupAt),
                  address: mission.dropoffAddress,
                },
              ],
            },
          })),
        },
      },
      include: {
        missions: {
          include: {
            stops: { orderBy: { sequence: "asc" } },
          },
          orderBy: { pickupAt: "asc" },
        },
      },
    });
  }

  async update(id: string, payload: UpdateOrderDto) {
    await this.ensureExists(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        organizationId: payload.organizationId,
        clientId: payload.clientId,
        legalEntityId: payload.legalEntityId,
        clientContactId: payload.clientContactId,
        serviceTypeId: payload.serviceTypeId,
        channel: payload.channel,
        externalReference: payload.externalReference,
        status: payload.status,
        internalNotes: payload.internalNotes,
      },
      include: {
        missions: {
          select: { id: true, label: true, status: true, pickupAt: true },
          orderBy: { pickupAt: "asc" },
        },
      },
    });
  }

  async confirm(id: string) {
    await this.ensureExists(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: "confirmed" },
    });
  }

  async cancel(id: string, payload: CancelOrderDto) {
    const order = await this.findOne(id);

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.mission.updateMany({
        where: { orderId: id, status: { not: "cancelled" } },
        data: {
          status: "cancelled",
          notes: payload.comment ?? payload.reason,
        },
      });

      return tx.order.update({
        where: { id },
        data: {
          status: "cancelled",
          internalNotes: [order.internalNotes, payload.reason, payload.comment]
            .filter(Boolean)
            .join(" | "),
        },
        include: {
          missions: {
            include: {
              stops: { orderBy: { sequence: "asc" } },
              assignment: true,
            },
            orderBy: { pickupAt: "asc" },
          },
        },
      });
    });

    return updated;
  }

  async duplicate(id: string) {
    const order = await this.findOne(id);

    return this.prisma.order.create({
      data: {
        organizationId: order.organizationId,
        clientId: order.clientId,
        legalEntityId: order.legalEntityId,
        clientContactId: order.clientContactId,
        serviceTypeId: order.serviceTypeId,
        channel: order.channel,
        externalReference: order.externalReference
          ? `${order.externalReference}-COPY`
          : null,
        status: "draft",
        internalNotes: order.internalNotes,
        missions: {
          create: order.missions.map((mission) => ({
            organizationId: mission.organizationId,
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
          })),
        },
      },
      include: {
        missions: {
          include: {
            stops: { orderBy: { sequence: "asc" } },
          },
          orderBy: { pickupAt: "asc" },
        },
      },
    });
  }

  async getTimeline(id: string) {
    const order = await this.findOne(id);

    const timeline = [
      {
        type: "order.created",
        at: order.createdAt,
        label: "Commande créée",
      },
      ...order.missions.map((mission) => ({
        type: `mission.${mission.status}`,
        at: mission.updatedAt,
        label: `${mission.label} - ${mission.status}`,
      })),
      {
        type: "order.updated",
        at: order.updatedAt,
        label: "Dernière mise à jour commande",
      },
    ].sort((a, b) => +new Date(a.at) - +new Date(b.at));

    return {
      orderId: order.id,
      timeline,
    };
  }

  private buildWhere(query: OrderQueryDto): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.clientId) where.clientId = query.clientId;
    if (query.status) where.status = query.status;

    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
      if (query.toDate) where.createdAt.lte = new Date(query.toDate);
    }

    if (query.q) {
      where.OR = [
        { externalReference: { contains: query.q, mode: "insensitive" } },
        { internalNotes: { contains: query.q, mode: "insensitive" } },
        {
          missions: {
            some: {
              OR: [
                { label: { contains: query.q, mode: "insensitive" } },
                {
                  stops: {
                    some: {
                      address: { contains: query.q, mode: "insensitive" },
                    },
                  },
                },
              ],
            },
          },
        },
      ];
    }

    return where;
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }
  }
}
