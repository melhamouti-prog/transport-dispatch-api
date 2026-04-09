import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "users",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "users",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "users",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "users",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "users",
      action: "remove",
      id,
    };
  }
}
