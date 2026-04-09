import { Injectable } from "@nestjs/common";

@Injectable()
export class FilesService {
  findAll(query?: Record<string, unknown>) {
    return {
      module: "files",
      action: "findAll",
      query: query ?? {},
      items: [],
    };
  }

  findOne(id: string) {
    return {
      module: "files",
      action: "findOne",
      id,
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      module: "files",
      action: "create",
      payload,
    };
  }

  update(id: string, payload: Record<string, unknown>) {
    return {
      module: "files",
      action: "update",
      id,
      payload,
    };
  }

  remove(id: string) {
    return {
      module: "files",
      action: "remove",
      id,
    };
  }
}
