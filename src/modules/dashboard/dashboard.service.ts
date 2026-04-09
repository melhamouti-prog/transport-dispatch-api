import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "dashboard",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "dashboard",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "dashboard",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "dashboard",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "dashboard",
      action: "remove",
      id,
    };
  }
}
