import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleCategoriesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "vehicle-categories",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "vehicle-categories",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "vehicle-categories",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "vehicle-categories",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "vehicle-categories",
      action: "remove",
      id,
    };
  }
}
