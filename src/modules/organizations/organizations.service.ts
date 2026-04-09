import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationsService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "organizations",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "organizations",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "organizations",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "organizations",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "organizations",
      action: "remove",
      id,
    };
  }
}
