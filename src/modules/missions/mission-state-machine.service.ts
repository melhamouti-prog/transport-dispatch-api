import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class MissionStateMachineService {
  private readonly transitions: Record<string, string[]> = {
    draft: ["quoted", "cancelled"],
    quoted: ["confirmed", "cancelled"],
    confirmed: ["driver_assigned", "cancelled"],
    driver_assigned: ["driver_accepted", "cancelled"],
    driver_accepted: ["en_route_pickup", "cancelled"],
    en_route_pickup: ["arrived_pickup", "cancelled"],
    arrived_pickup: ["passenger_onboard", "cancelled"],
    passenger_onboard: ["completed"],
    completed: ["closed", "invoiced"],
    closed: ["invoiced"],
    invoiced: ["paid"],
    paid: [],
    cancelled: [],
  };

  canTransition(fromStatus: string, toStatus: string) {
    if (!fromStatus) return true;
    return (this.transitions[fromStatus] ?? []).includes(toStatus);
  }

  assertTransition(fromStatus: string, toStatus: string) {
    if (!this.canTransition(fromStatus, toStatus)) {
      throw new BadRequestException(
        `Transition invalide de ${fromStatus} vers ${toStatus}`,
      );
    }
  }
}
