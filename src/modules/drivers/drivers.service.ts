import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { DriverQueryDto } from "./dto/driver-query.dto";
import { UpdateDriverDto } from "./dto/update-driver.dto";

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: DriverQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.DriverWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.partnerId) where.partnerId = query.partnerId;
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { firstName: { contains: query.q, mode: "insensitive" } },
        { lastName: { contains: query.q, mode: "insensitive" } },
        { email: { contains: query.q, mode: "insensitive" } },
        { code: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.driver.count({ where }),
      this.prisma.driver.findMany({
        where,
        include: {
          partner: { select: { id: true, name: true } },
          user: { select: { id: true, email: true } },
          missionAssignments: {
            take: 5,
            orderBy: { assignedAt: "desc" },
            include: {
              mission: {
                select: { id: true, label: true, status: true, pickupAt: true },
              },
            },
          },
          _count: { select: { complianceItems: true } },
        },
        orderBy: [{ status: "asc" }, { lastName: "asc" }],
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
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        partner: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
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
      },
    });

    if (!driver) throw new NotFoundException(`Chauffeur ${id} introuvable`);
    return driver;
  }

  async create(payload: CreateDriverDto) {
    return this.prisma.driver.create({
      data: {
        ...payload,
        professionalCardExpiry: payload.professionalCardExpiry
          ? new Date(payload.professionalCardExpiry)
          : undefined,
        medicalVisitExpiry: payload.medicalVisitExpiry
          ? new Date(payload.medicalVisitExpiry)
          : undefined,
        status: payload.status ?? "active",
      },
      include: { partner: true, user: { select: { id: true, email: true } } },
    });
  }

  async update(id: string, payload: UpdateDriverDto) {
    await this.ensureExists(id);
    return this.prisma.driver.update({
      where: { id },
      data: {
        ...payload,
        professionalCardExpiry: payload.professionalCardExpiry
          ? new Date(payload.professionalCardExpiry)
          : undefined,
        medicalVisitExpiry: payload.medicalVisitExpiry
          ? new Date(payload.medicalVisitExpiry)
          : undefined,
      },
      include: { partner: true, user: { select: { id: true, email: true } } },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.driver.update({
      where: { id },
      data: { status: "archived" },
    });
  }

  private async ensureExists(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!driver) throw new NotFoundException(`Chauffeur ${id} introuvable`);
  }
}
