import { Injectable } from "@nestjs/common";

@Injectable()
export class ReportsService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "reports",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "reports",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "reports",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "reports",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "reports",
      action: "remove",
      id,
    };
  }
}
