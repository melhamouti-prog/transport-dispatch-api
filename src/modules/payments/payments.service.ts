import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaymentQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.PaymentWhereInput = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { reference: { contains: query.q, mode: "insensitive" } },
        { paymentMethod: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              id: true,
              number: true,
              outstandingAmount: true,
              totalAmount: true,
            },
          },
        },
        orderBy: { paymentDate: "desc" },
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
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });
    if (!payment) throw new NotFoundException(`Paiement ${id} introuvable`);
    return payment;
  }

  async create(payload: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          organizationId: payload.organizationId,
          invoiceId: payload.invoiceId,
          amount: payload.amount,
          currency: payload.currency ?? "EUR",
          paymentMethod: payload.paymentMethod,
          paymentDate: new Date(payload.paymentDate),
          reference: payload.reference,
          status: payload.status ?? "received",
        },
      });

      const paid = await tx.payment.aggregate({
        where: { invoiceId: payload.invoiceId, status: { not: "cancelled" } },
        _sum: { amount: true },
      });

      const invoice = await tx.invoice.findUniqueOrThrow({
        where: { id: payload.invoiceId },
      });
      const outstandingAmount =
        Number(invoice.totalAmount) - Number(paid._sum.amount ?? 0);

      await tx.invoice.update({
        where: { id: payload.invoiceId },
        data: {
          outstandingAmount,
          status: outstandingAmount <= 0 ? "paid" : invoice.status,
        },
      });

      return tx.payment.findUnique({
        where: { id: payment.id },
        include: { invoice: true },
      });
    });
  }

  async update(id: string, payload: UpdatePaymentDto) {
    const existing = await this.findOne(id);
    const invoiceId = payload.invoiceId ?? existing.invoiceId;

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: {
          organizationId: payload.organizationId,
          invoiceId: payload.invoiceId,
          amount: payload.amount,
          currency: payload.currency,
          paymentMethod: payload.paymentMethod,
          paymentDate: payload.paymentDate
            ? new Date(payload.paymentDate)
            : undefined,
          reference: payload.reference,
          status: payload.status,
        },
      });

      const paid = await tx.payment.aggregate({
        where: { invoiceId, status: { not: "cancelled" } },
        _sum: { amount: true },
      });
      const invoice = await tx.invoice.findUniqueOrThrow({
        where: { id: invoiceId },
      });
      const outstandingAmount =
        Number(invoice.totalAmount) - Number(paid._sum.amount ?? 0);

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          outstandingAmount,
          status:
            outstandingAmount <= 0
              ? "paid"
              : invoice.status === "paid"
                ? "issued"
                : invoice.status,
        },
      });

      return tx.payment.findUnique({
        where: { id: payment.id },
        include: { invoice: true },
      });
    });
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: { status: "cancelled" },
      });
      const paid = await tx.payment.aggregate({
        where: { invoiceId: existing.invoiceId, status: { not: "cancelled" } },
        _sum: { amount: true },
      });
      const invoice = await tx.invoice.findUniqueOrThrow({
        where: { id: existing.invoiceId },
      });
      const outstandingAmount =
        Number(invoice.totalAmount) - Number(paid._sum.amount ?? 0);
      await tx.invoice.update({
        where: { id: existing.invoiceId },
        data: {
          outstandingAmount,
          status: outstandingAmount <= 0 ? "paid" : "issued",
        },
      });
      return payment;
    });
  }
}
