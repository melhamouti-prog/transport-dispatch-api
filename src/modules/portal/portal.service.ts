import { Injectable } from "@nestjs/common";

@Injectable()
export class PortalService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "portal",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "portal",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "portal",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "portal",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "portal",
      action: "remove",
      id,
    };
  }
}
