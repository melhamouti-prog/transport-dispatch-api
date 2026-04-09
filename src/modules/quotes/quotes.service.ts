import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { QuoteQueryDto } from "./dto/quote-query.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuoteQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.QuoteWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.clientId) where.clientId = query.clientId;
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { number: { contains: query.q, mode: "insensitive" } },
        { notes: { contains: query.q, mode: "insensitive" } },
        { client: { name: { contains: query.q, mode: "insensitive" } } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.quote.count({ where }),
      this.prisma.quote.findMany({
        where,
        include: {
          client: { select: { id: true, name: true } },
          order: { select: { id: true, externalReference: true } },
          lines: { orderBy: { sequence: "asc" } },
        },
        orderBy: { issueDate: "desc" },
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
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        client: true,
        order: true,
        legalEntity: true,
        lines: { orderBy: { sequence: "asc" } },
      },
    });
    if (!quote) throw new NotFoundException(`Devis ${id} introuvable`);
    return quote;
  }

  async create(payload: CreateQuoteDto) {
    const amounts = this.computeAmounts(payload.lines);
    return this.prisma.quote.create({
      data: {
        organizationId: payload.organizationId,
        orderId: payload.orderId,
        clientId: payload.clientId,
        legalEntityId: payload.legalEntityId,
        number: payload.number,
        status: payload.status ?? "draft",
        issueDate: new Date(payload.issueDate),
        validUntil: payload.validUntil
          ? new Date(payload.validUntil)
          : undefined,
        subtotal: amounts.subtotal,
        taxAmount: amounts.taxAmount,
        totalAmount: amounts.totalAmount,
        notes: payload.notes,
        lines: {
          create: payload.lines.map((line, index) => {
            const totalAmount = Number(line.quantity) * Number(line.unitPrice);
            return {
              sequence: index + 1,
              label: line.label,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              taxRate: line.taxRate,
              totalAmount,
            };
          }),
        },
      },
      include: {
        client: true,
        order: true,
        lines: { orderBy: { sequence: "asc" } },
      },
    });
  }

  async update(id: string, payload: UpdateQuoteDto) {
    await this.ensureExists(id);

    return this.prisma.$transaction(async (tx) => {
      if (payload.lines) {
        await tx.quoteLine.deleteMany({ where: { quoteId: id } });
      }

      const amounts = payload.lines ? this.computeAmounts(payload.lines) : null;

      return tx.quote.update({
        where: { id },
        data: {
          organizationId: payload.organizationId,
          orderId: payload.orderId,
          clientId: payload.clientId,
          legalEntityId: payload.legalEntityId,
          number: payload.number,
          status: payload.status,
          issueDate: payload.issueDate
            ? new Date(payload.issueDate)
            : undefined,
          validUntil: payload.validUntil
            ? new Date(payload.validUntil)
            : undefined,
          subtotal: amounts?.subtotal,
          taxAmount: amounts?.taxAmount,
          totalAmount: amounts?.totalAmount,
          notes: payload.notes,
          lines: payload.lines
            ? {
                create: payload.lines.map((line, index) => ({
                  sequence: index + 1,
                  label: line.label,
                  quantity: line.quantity,
                  unitPrice: line.unitPrice,
                  taxRate: line.taxRate,
                  totalAmount: Number(line.quantity) * Number(line.unitPrice),
                })),
              }
            : undefined,
        },
        include: {
          client: true,
          order: true,
          lines: { orderBy: { sequence: "asc" } },
        },
      });
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.quote.update({
      where: { id },
      data: { status: "cancelled" },
    });
  }

  private computeAmounts(
    lines: Array<{ quantity: number; unitPrice: number; taxRate?: number }>,
  ) {
    const subtotal = lines.reduce(
      (sum, line) => sum + Number(line.quantity) * Number(line.unitPrice),
      0,
    );
    const taxAmount = lines.reduce(
      (sum, line) =>
        sum +
        Number(line.quantity) *
          Number(line.unitPrice) *
          (Number(line.taxRate ?? 0) / 100),
      0,
    );
    return { subtotal, taxAmount, totalAmount: subtotal + taxAmount };
  }

  private async ensureExists(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!quote) throw new NotFoundException(`Devis ${id} introuvable`);
  }
}
