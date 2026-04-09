import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "notifications",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "notifications",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "notifications",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "notifications",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "notifications",
      action: "remove",
      id,
    };
  }
}
