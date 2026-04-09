import { Injectable } from "@nestjs/common";

@Injectable()
export class ComplianceService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "compliance",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "compliance",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "compliance",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "compliance",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "compliance",
      action: "remove",
      id,
    };
  }
}
