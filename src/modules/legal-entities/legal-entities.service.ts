import { Injectable } from "@nestjs/common";

@Injectable()
export class LegalEntitiesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "legal-entities",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "legal-entities",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "legal-entities",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "legal-entities",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "legal-entities",
      action: "remove",
      id,
    };
  }
}
