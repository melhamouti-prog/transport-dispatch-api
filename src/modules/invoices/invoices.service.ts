import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { InvoiceQueryDto } from "./dto/invoice-query.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: InvoiceQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.InvoiceWhereInput = {};

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
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.findMany({
        where,
        include: {
          client: { select: { id: true, name: true } },
          order: { select: { id: true, externalReference: true } },
          lines: { orderBy: { sequence: "asc" } },
          payments: { orderBy: { paymentDate: "desc" } },
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
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        order: true,
        legalEntity: true,
        lines: { orderBy: { sequence: "asc" } },
        payments: { orderBy: { paymentDate: "desc" } },
      },
    });
    if (!invoice) throw new NotFoundException(`Facture ${id} introuvable`);
    return invoice;
  }

  async create(payload: CreateInvoiceDto) {
    const amounts = this.computeAmounts(payload.lines);
    return this.prisma.invoice.create({
      data: {
        organizationId: payload.organizationId,
        orderId: payload.orderId,
        clientId: payload.clientId,
        legalEntityId: payload.legalEntityId,
        number: payload.number,
        status: payload.status ?? "draft",
        issueDate: new Date(payload.issueDate),
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        subtotal: amounts.subtotal,
        taxAmount: amounts.taxAmount,
        totalAmount: amounts.totalAmount,
        outstandingAmount: amounts.totalAmount,
        notes: payload.notes,
        lines: {
          create: payload.lines.map((line, index) => ({
            sequence: index + 1,
            label: line.label,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRate: line.taxRate,
            totalAmount: Number(line.quantity) * Number(line.unitPrice),
          })),
        },
      },
      include: {
        client: true,
        order: true,
        lines: { orderBy: { sequence: "asc" } },
        payments: true,
      },
    });
  }

  async update(id: string, payload: UpdateInvoiceDto) {
    await this.ensureExists(id);

    return this.prisma.$transaction(async (tx) => {
      if (payload.lines) {
        await tx.invoiceLine.deleteMany({ where: { invoiceId: id } });
      }

      const amounts = payload.lines ? this.computeAmounts(payload.lines) : null;

      return tx.invoice.update({
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
          dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
          subtotal: amounts?.subtotal,
          taxAmount: amounts?.taxAmount,
          totalAmount: amounts?.totalAmount,
          outstandingAmount: amounts?.totalAmount,
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
          payments: true,
        },
      });
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.invoice.update({
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
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!invoice) throw new NotFoundException(`Facture ${id} introuvable`);
  }
}
