import { Injectable } from "@nestjs/common";

@Injectable()
export class AddressesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "addresses",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "addresses",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "addresses",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "addresses",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "addresses",
      action: "remove",
      id,
    };
  }
}
