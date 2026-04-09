import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "search",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "search",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "search",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "search",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "search",
      action: "remove",
      id,
    };
  }
}
