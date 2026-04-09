import { Injectable } from "@nestjs/common";

@Injectable()
export class PartnersService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "partners",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "partners",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "partners",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "partners",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "partners",
      action: "remove",
      id,
    };
  }
}
