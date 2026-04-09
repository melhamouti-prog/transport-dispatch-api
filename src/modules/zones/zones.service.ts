import { Injectable } from "@nestjs/common";

@Injectable()
export class ZonesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "zones",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "zones",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "zones",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "zones",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "zones",
      action: "remove",
      id,
    };
  }
}
