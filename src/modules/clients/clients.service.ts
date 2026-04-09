import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { ClientQueryDto } from "./dto/client-query.dto";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ClientQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.ClientWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { legalName: { contains: query.q, mode: "insensitive" } },
        { email: { contains: query.q, mode: "insensitive" } },
        { code: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.client.count({ where }),
      this.prisma.client.findMany({
        where,
        include: {
          contacts: true,
          _count: { select: { orders: true, invoices: true, quotes: true } },
        },
        orderBy: { name: "asc" },
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
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        contacts: true,
        passengers: true,
        savedPlaces: true,
        orders: {
          select: {
            id: true,
            externalReference: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        invoices: {
          select: {
            id: true,
            number: true,
            status: true,
            totalAmount: true,
            issueDate: true,
          },
          orderBy: { issueDate: "desc" },
          take: 10,
        },
        quotes: {
          select: {
            id: true,
            number: true,
            status: true,
            totalAmount: true,
            issueDate: true,
          },
          orderBy: { issueDate: "desc" },
          take: 10,
        },
      },
    });

    if (!client) throw new NotFoundException(`Client ${id} introuvable`);
    return client;
  }

  async create(payload: CreateClientDto) {
    return this.prisma.client.create({
      data: payload,
      include: { contacts: true },
    });
  }

  async update(id: string, payload: UpdateClientDto) {
    await this.ensureExists(id);
    return this.prisma.client.update({
      where: { id },
      data: payload,
      include: { contacts: true },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.client.update({
      where: { id },
      data: { status: "archived" },
    });
  }

  private async ensureExists(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!client) throw new NotFoundException(`Client ${id} introuvable`);
  }
}
