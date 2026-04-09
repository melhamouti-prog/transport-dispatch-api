import { Injectable } from "@nestjs/common";

@Injectable()
export class PassengersService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "passengers",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "passengers",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "passengers",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "passengers",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "passengers",
      action: "remove",
      id,
    };
  }
}
