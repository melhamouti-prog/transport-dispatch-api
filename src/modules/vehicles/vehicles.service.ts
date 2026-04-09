import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleQueryDto } from "./dto/vehicle-query.dto";

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: VehicleQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.VehicleWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.partnerId) where.partnerId = query.partnerId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { registrationNumber: { contains: query.q, mode: "insensitive" } },
        { label: { contains: query.q, mode: "insensitive" } },
        { brand: { contains: query.q, mode: "insensitive" } },
        { model: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({
        where,
        include: {
          partner: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, seats: true } },
          missionAssignments: {
            take: 5,
            orderBy: { assignedAt: "desc" },
            include: {
              mission: {
                select: { id: true, label: true, status: true, pickupAt: true },
              },
            },
          },
          _count: {
            select: { complianceItems: true, maintenanceEvents: true },
          },
        },
        orderBy: [{ status: "asc" }, { registrationNumber: "asc" }],
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        partner: true,
        category: true,
        missionAssignments: {
          orderBy: { assignedAt: "desc" },
          take: 20,
          include: {
            mission: { include: { stops: { orderBy: { sequence: "asc" } } } },
          },
        },
        complianceItems: {
          include: { complianceType: true },
          orderBy: { expiresAt: "asc" },
        },
        maintenanceEvents: { orderBy: { dueAt: "asc" }, take: 20 },
      },
    });

    if (!vehicle) throw new NotFoundException(`Véhicule ${id} introuvable`);
    return vehicle;
  }

  async create(payload: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: { ...payload, status: payload.status ?? "active" },
      include: { partner: true, category: true },
    });
  }

  async update(id: string, payload: UpdateVehicleDto) {
    await this.ensureExists(id);
    return this.prisma.vehicle.update({
      where: { id },
      data: payload,
      include: { partner: true, category: true },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.vehicle.update({
      where: { id },
      data: { status: "archived" },
    });
  }

  private async ensureExists(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!vehicle) throw new NotFoundException(`Véhicule ${id} introuvable`);
  }
}
