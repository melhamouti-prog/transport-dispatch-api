import { Injectable } from "@nestjs/common";

@Injectable()
export class ReservationsService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "reservations",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "reservations",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "reservations",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "reservations",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "reservations",
      action: "remove",
      id,
    };
  }
}
