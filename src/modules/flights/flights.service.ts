import { Injectable } from "@nestjs/common";

@Injectable()
export class FlightsService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "flights",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "flights",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "flights",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "flights",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "flights",
      action: "remove",
      id,
    };
  }
}
