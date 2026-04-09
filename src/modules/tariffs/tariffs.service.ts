import { Injectable } from "@nestjs/common";

@Injectable()
export class TariffsService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "tariffs",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "tariffs",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "tariffs",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "tariffs",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "tariffs",
      action: "remove",
      id,
    };
  }
}
