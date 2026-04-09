import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { PermissionsGuard } from "./common/guards/permissions.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { LegalEntitiesModule } from "./modules/legal-entities/legal-entities.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { FilesModule } from "./modules/files/files.module";
import { AddressesModule } from "./modules/addresses/addresses.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { PassengersModule } from "./modules/passengers/passengers.module";
import { PartnersModule } from "./modules/partners/partners.module";
import { DriversModule } from "./modules/drivers/drivers.module";
import { VehiclesModule } from "./modules/vehicles/vehicles.module";
import { VehicleCategoriesModule } from "./modules/vehicle-categories/vehicle-categories.module";
import { ServiceTypesModule } from "./modules/service-types/service-types.module";
import { ZonesModule } from "./modules/zones/zones.module";
import { TariffsModule } from "./modules/tariffs/tariffs.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { MissionsModule } from "./modules/missions/missions.module";
import { PlanningModule } from "./modules/planning/planning.module";
import { FlightsModule } from "./modules/flights/flights.module";
import { DriverAppModule } from "./modules/driver-app/driver-app.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ReservationsModule } from "./modules/reservations/reservations.module";
import { PortalModule } from "./modules/portal/portal.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ComplianceModule } from "./modules/compliance/compliance.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { SearchModule } from "./modules/search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    LegalEntitiesModule,
    UsersModule,
    RolesModule,
    FilesModule,
    AddressesModule,
    ClientsModule,
    PassengersModule,
    PartnersModule,
    DriversModule,
    VehiclesModule,
    VehicleCategoriesModule,
    ServiceTypesModule,
    ZonesModule,
    TariffsModule,
    OrdersModule,
    MissionsModule,
    PlanningModule,
    FlightsModule,
    DriverAppModule,
    QuotesModule,
    InvoicesModule,
    PaymentsModule,
    ReservationsModule,
    PortalModule,
    NotificationsModule,
    ComplianceModule,
    ReportsModule,
    DashboardModule,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
