import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceTypesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "service-types",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "service-types",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "service-types",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "service-types",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "service-types",
      action: "remove",
      id,
    };
  }
}
