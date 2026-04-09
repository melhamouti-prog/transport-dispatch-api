import { Injectable } from "@nestjs/common";

@Injectable()
export class RolesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "roles",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "roles",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "roles",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "roles",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "roles",
      action: "remove",
      id,
    };
  }
}
