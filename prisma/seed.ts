import { Prisma, PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

const ORG_SLUG = "demo-way-plan";
const ORG_NAME = "WAY Demo Transport";
const DEMO_CREDENTIALS = {
  admin: { email: "admin@waydemo.test", password: "Admin123!" },
  dispatcher: { email: "dispatch@waydemo.test", password: "Dispatch123!" },
  driver1: { email: "sami.belhadj@waydemo.test", password: "Driver123!" },
  driver2: { email: "nora.elfassi@waydemo.test", password: "Driver123!" },
  driver3: { email: "julien.roche@waydemo.test", password: "Driver123!" },
};

const hashSecret = async (secret: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(secret, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
};

const money = (value: number) => new Prisma.Decimal(value.toFixed(2));

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const addHours = (date: Date, hours: number) => {
  const next = new Date(date);
  next.setUTCHours(next.getUTCHours() + hours);
  return next;
};

const addMinutes = (date: Date, minutes: number) => {
  const next = new Date(date);
  next.setUTCMinutes(next.getUTCMinutes() + minutes);
  return next;
};

const startOfUtcDay = (date: Date) => {
  const next = new Date(date);
  next.setUTCHours(0, 0, 0, 0);
  return next;
};

const toDateOnly = (date: Date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

const startOfWeekMondayUtc = (date: Date) => {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return startOfUtcDay(addDays(date, diff));
};

const permissionsSeed = [
  { code: "dashboard.read", label: "Lire le dashboard" },
  { code: "orders.read", label: "Lire les commandes" },
  { code: "orders.write", label: "Gérer les commandes" },
  { code: "missions.read", label: "Lire les missions" },
  { code: "missions.dispatch", label: "Dispatcher les missions" },
  { code: "planning.read", label: "Lire le planning" },
  { code: "planning.write", label: "Modifier le planning" },
  { code: "clients.manage", label: "Gérer les clients" },
  { code: "billing.manage", label: "Gérer devis et factures" },
  { code: "drivers.self", label: "Accès chauffeur mobile" },
];

const clientsSeed = [
  {
    name: "Hôtel Le Grand Paris",
    email: "conciergerie@grandparis.test",
    phone: "+33 1 40 10 10 10",
    city: "Paris",
  },
  {
    name: "Cabinet Durand Avocats",
    email: "assistante@durand-avocats.test",
    phone: "+33 1 44 20 33 10",
    city: "Paris",
  },
  {
    name: "Clinique Saint-Lazare",
    email: "transport@clinique-stlazare.test",
    phone: "+33 1 45 30 44 55",
    city: "Paris",
  },
  {
    name: "Blue Horizon Events",
    email: "ops@bluehorizon-events.test",
    phone: "+33 1 46 90 90 90",
    city: "Boulogne-Billancourt",
  },
  {
    name: "AéroJet Assistance",
    email: "dispatch@aerojet.test",
    phone: "+33 1 70 20 20 20",
    city: "Roissy-en-France",
  },
  {
    name: "TechNova France",
    email: "travel@technova.test",
    phone: "+33 1 42 11 11 11",
    city: "Paris",
  },
  {
    name: "Maison Rivoli",
    email: "frontdesk@maisonrivoli.test",
    phone: "+33 1 43 22 22 22",
    city: "Paris",
  },
  {
    name: "Groupe Mistral",
    email: "office@groupe-mistral.test",
    phone: "+33 1 47 77 77 77",
    city: "Courbevoie",
  },
  {
    name: "Premium Weddings",
    email: "planning@premiumweddings.test",
    phone: "+33 1 48 88 88 88",
    city: "Versailles",
  },
  {
    name: "Travel Connect Europe",
    email: "bookings@travel-connect.test",
    phone: "+33 1 49 99 99 99",
    city: "Paris",
  },
];

const routeTemplates = [
  {
    label: "CDG Terminal 2E → Hôtel Opéra",
    pickupAddress: "Aéroport CDG Terminal 2E, Roissy-en-France",
    dropoffAddress: "2 Rue Scribe, 75009 Paris",
    distanceKm: 31,
    durationMinutes: 50,
    price: 92,
  },
  {
    label: "Gare de Lyon → La Défense",
    pickupAddress: "Place Louis-Armand, 75012 Paris",
    dropoffAddress: "Parvis de La Défense, 92800 Puteaux",
    distanceKm: 16,
    durationMinutes: 40,
    price: 58,
  },
  {
    label: "Le Bourget → Avenue Montaigne",
    pickupAddress: "Aéroport Paris-Le Bourget, 93350 Le Bourget",
    dropoffAddress: "Avenue Montaigne, 75008 Paris",
    distanceKm: 22,
    durationMinutes: 45,
    price: 74,
  },
  {
    label: "Versailles → Orly",
    pickupAddress: "1 Place d’Armes, 78000 Versailles",
    dropoffAddress: "Aéroport Paris-Orly, 94390 Orly",
    distanceKm: 30,
    durationMinutes: 45,
    price: 78,
  },
  {
    label: "Paris centre → Disneyland Paris",
    pickupAddress: "6 Avenue de l’Opéra, 75001 Paris",
    dropoffAddress: "Disneyland Hotel, Chessy",
    distanceKm: 43,
    durationMinutes: 55,
    price: 110,
  },
  {
    label: "Orly → Boulogne",
    pickupAddress: "Aéroport Paris-Orly 3, Orly",
    dropoffAddress: "35 Avenue Victor Hugo, 92100 Boulogne-Billancourt",
    distanceKm: 24,
    durationMinutes: 38,
    price: 69,
  },
  {
    label: "Neuilly → Stade de France",
    pickupAddress: "Place du Marché, 92200 Neuilly-sur-Seine",
    dropoffAddress: "93216 Saint-Denis",
    distanceKm: 15,
    durationMinutes: 35,
    price: 54,
  },
  {
    label: "Tour Eiffel → Roissy",
    pickupAddress: "5 Avenue Anatole France, 75007 Paris",
    dropoffAddress: "Aéroport CDG Terminal 1, Roissy-en-France",
    distanceKm: 35,
    durationMinutes: 60,
    price: 97,
  },
  {
    label: "La Défense → Parc des Expositions",
    pickupAddress: "1 Esplanade de La Défense, 92800 Puteaux",
    dropoffAddress: "Parc des Expositions de Villepinte",
    distanceKm: 29,
    durationMinutes: 50,
    price: 82,
  },
  {
    label: "Montparnasse → Meudon",
    pickupAddress: "17 Boulevard de Vaugirard, 75015 Paris",
    dropoffAddress: "10 Route des Gardes, 92190 Meudon",
    distanceKm: 12,
    durationMinutes: 30,
    price: 46,
  },
];

async function main() {
  console.log("🌱 Initialisation des données de démonstration Prisma…");

  for (const permission of permissionsSeed) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { label: permission.label },
      create: {
        code: permission.code,
        label: permission.label,
        description: permission.label,
      },
    });
  }

  const existingOrganization = await prisma.organization.findUnique({
    where: { slug: ORG_SLUG },
    select: { id: true },
  });

  if (existingOrganization) {
    await prisma.organization.delete({
      where: { id: existingOrganization.id },
    });
    console.log("🧹 Ancienne organisation de démonstration supprimée.");
  }

  const organization = await prisma.organization.create({
    data: {
      name: ORG_NAME,
      slug: ORG_SLUG,
      defaultCurrency: "EUR",
      defaultTimezone: "Europe/Paris",
      locale: "fr-FR",
      settingsJson: {
        productName: "WAY Demo",
        planningDefaultView: "week",
        allowDriverSelfAccept: true,
      },
    },
  });

  const legalEntity = await prisma.legalEntity.create({
    data: {
      organizationId: organization.id,
      name: "WAY Demo Mobility SAS",
      code: "WAY-DEMO",
      registrationNumber: "RCS Paris 909090909",
      vatNumber: "FR85909090909",
      email: "facturation@waydemo.test",
      phone: "+33 1 80 80 80 80",
      invoicePrefix: "WD",
      isDefault: true,
    },
  });

  const [superAdminRole, dispatcherRole, driverRole] = await Promise.all([
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: "Super administrateur",
        code: "super_admin",
        description: "Accès complet à la plateforme",
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: "Dispatcher",
        code: "dispatcher",
        description: "Gère les ordres, missions et planning",
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: "Chauffeur",
        code: "driver",
        description: "Accès mobile chauffeur",
        isSystem: true,
      },
    }),
  ]);

  const permissions = await prisma.permission.findMany({
    where: { code: { in: permissionsSeed.map((item) => item.code) } },
  });
  const permissionByCode = new Map(
    permissions.map((item) => [item.code, item]),
  );

  const rolePermissions: Record<string, string[]> = {
    super_admin: permissionsSeed.map((item) => item.code),
    dispatcher: [
      "dashboard.read",
      "orders.read",
      "orders.write",
      "missions.read",
      "missions.dispatch",
      "planning.read",
      "planning.write",
      "clients.manage",
      "billing.manage",
    ],
    driver: ["missions.read", "drivers.self"],
  };

  for (const [roleCode, codes] of Object.entries(rolePermissions)) {
    const role = [superAdminRole, dispatcherRole, driverRole].find(
      (item) => item.code === roleCode,
    )!;
    for (const code of codes) {
      const permission = permissionByCode.get(code);
      if (!permission) continue;
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const adminUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      firstName: "Admin",
      lastName: "Demo",
      email: DEMO_CREDENTIALS.admin.email,
      phone: "+33 6 10 10 10 10",
      passwordHash: await hashSecret(DEMO_CREDENTIALS.admin.password),
      status: "active",
    },
  });

  const dispatcherUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      firstName: "Claire",
      lastName: "Martin",
      email: DEMO_CREDENTIALS.dispatcher.email,
      phone: "+33 6 20 20 20 20",
      passwordHash: await hashSecret(DEMO_CREDENTIALS.dispatcher.password),
      status: "active",
    },
  });

  await prisma.userRole.createMany({
    data: [
      {
        organizationId: organization.id,
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
      {
        organizationId: organization.id,
        userId: dispatcherUser.id,
        roleId: dispatcherRole.id,
      },
    ],
  });

  const partner = await prisma.partner.create({
    data: {
      organizationId: organization.id,
      name: "Alliance Mobility Partners",
      legalName: "Alliance Mobility Partners SARL",
      email: "contact@alliance-mobility.test",
      phone: "+33 1 55 66 77 88",
      status: "active",
      notes: "Sous-traitant premium pour les débordements de capacité.",
    },
  });

  const vehicleCategories = {
    berline: await prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: "Berline",
        code: "BERLINE",
        seats: 4,
        luggageCount: 3,
      },
    }),
    van: await prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: "Van",
        code: "VAN",
        seats: 7,
        luggageCount: 8,
      },
    }),
  };

  const serviceTypes = {
    transfer: await prisma.serviceType.create({
      data: {
        organizationId: organization.id,
        code: "TRANSFER",
        name: "Transfert simple",
        description: "Trajet ponctuel avec prise en charge et dépose",
        basePrice: money(65),
      },
    }),
    airport: await prisma.serviceType.create({
      data: {
        organizationId: organization.id,
        code: "AIRPORT",
        name: "Transfert aéroport",
        description: "Service spécialisé aéroport / gare",
        basePrice: money(85),
      },
    }),
    hourly: await prisma.serviceType.create({
      data: {
        organizationId: organization.id,
        code: "HOURLY",
        name: "Mise à disposition",
        description: "Chauffeur à disposition à l’heure",
        basePrice: money(180),
      },
    }),
  };

  const parisZone = await prisma.zone.create({
    data: {
      organizationId: organization.id,
      code: "PARIS",
      name: "Paris intramuros",
      zoneType: "city",
      metaJson: { perimeter: "75" },
    },
  });

  const tariffProfile = await prisma.tariffProfile.create({
    data: {
      organizationId: organization.id,
      name: "Tarif standard 2026",
      code: "STANDARD-2026",
      currency: "EUR",
      isDefault: true,
    },
  });

  await prisma.tariffRule.createMany({
    data: [
      {
        organizationId: organization.id,
        profileId: tariffProfile.id,
        serviceTypeId: serviceTypes.transfer.id,
        zoneId: parisZone.id,
        billingMode: "flat",
        amount: money(65),
        vatRate: money(10),
      },
      {
        organizationId: organization.id,
        profileId: tariffProfile.id,
        serviceTypeId: serviceTypes.airport.id,
        zoneId: parisZone.id,
        billingMode: "flat",
        amount: money(95),
        vatRate: money(10),
      },
      {
        organizationId: organization.id,
        profileId: tariffProfile.id,
        serviceTypeId: serviceTypes.hourly.id,
        zoneId: parisZone.id,
        billingMode: "flat",
        amount: money(180),
        vatRate: money(20),
      },
    ],
  });

  const driverUsers = await Promise.all([
    prisma.user.create({
      data: {
        organizationId: organization.id,
        firstName: "Sami",
        lastName: "Belhadj",
        email: DEMO_CREDENTIALS.driver1.email,
        phone: "+33 6 30 30 30 30",
        passwordHash: await hashSecret(DEMO_CREDENTIALS.driver1.password),
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        firstName: "Nora",
        lastName: "El Fassi",
        email: DEMO_CREDENTIALS.driver2.email,
        phone: "+33 6 31 31 31 31",
        passwordHash: await hashSecret(DEMO_CREDENTIALS.driver2.password),
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        firstName: "Julien",
        lastName: "Roche",
        email: DEMO_CREDENTIALS.driver3.email,
        phone: "+33 6 32 32 32 32",
        passwordHash: await hashSecret(DEMO_CREDENTIALS.driver3.password),
        status: "active",
      },
    }),
  ]);

  await prisma.userRole.createMany({
    data: driverUsers.map((user) => ({
      organizationId: organization.id,
      userId: user.id,
      roleId: driverRole.id,
    })),
  });

  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        organizationId: organization.id,
        userId: driverUsers[0].id,
        code: "DRV-001",
        firstName: "Sami",
        lastName: "Belhadj",
        email: driverUsers[0].email,
        phone: driverUsers[0].phone,
        status: "active",
        licenseNumber: "LIC-001-DEMO",
        professionalCardNumber: "CP-DRV-001",
        professionalCardExpiry: addDays(new Date(), 420),
        medicalVisitExpiry: addDays(new Date(), 180),
      },
    }),
    prisma.driver.create({
      data: {
        organizationId: organization.id,
        userId: driverUsers[1].id,
        code: "DRV-002",
        firstName: "Nora",
        lastName: "El Fassi",
        email: driverUsers[1].email,
        phone: driverUsers[1].phone,
        status: "active",
        licenseNumber: "LIC-002-DEMO",
        professionalCardNumber: "CP-DRV-002",
        professionalCardExpiry: addDays(new Date(), 390),
        medicalVisitExpiry: addDays(new Date(), 210),
      },
    }),
    prisma.driver.create({
      data: {
        organizationId: organization.id,
        partnerId: partner.id,
        userId: driverUsers[2].id,
        code: "DRV-003",
        firstName: "Julien",
        lastName: "Roche",
        email: driverUsers[2].email,
        phone: driverUsers[2].phone,
        status: "active",
        licenseNumber: "LIC-003-DEMO",
        professionalCardNumber: "CP-DRV-003",
        professionalCardExpiry: addDays(new Date(), 300),
        medicalVisitExpiry: addDays(new Date(), 120),
      },
    }),
  ]);

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        organizationId: organization.id,
        categoryId: vehicleCategories.berline.id,
        registrationNumber: "AA-101-DE",
        label: "Mercedes Classe E #1",
        brand: "Mercedes-Benz",
        model: "Classe E",
        color: "Noir",
        seats: 4,
        luggageCount: 3,
        status: "active",
      },
    }),
    prisma.vehicle.create({
      data: {
        organizationId: organization.id,
        categoryId: vehicleCategories.berline.id,
        registrationNumber: "BB-202-DE",
        label: "BMW Série 5 #2",
        brand: "BMW",
        model: "Série 5",
        color: "Noir",
        seats: 4,
        luggageCount: 3,
        status: "active",
      },
    }),
    prisma.vehicle.create({
      data: {
        organizationId: organization.id,
        categoryId: vehicleCategories.van.id,
        registrationNumber: "CC-303-DE",
        label: "Mercedes V-Class #3",
        brand: "Mercedes-Benz",
        model: "Classe V",
        color: "Noir",
        seats: 7,
        luggageCount: 8,
        status: "active",
      },
    }),
    prisma.vehicle.create({
      data: {
        organizationId: organization.id,
        partnerId: partner.id,
        categoryId: vehicleCategories.van.id,
        registrationNumber: "DD-404-DE",
        label: "Ford Tourneo #4",
        brand: "Ford",
        model: "Tourneo Custom",
        color: "Gris",
        seats: 8,
        luggageCount: 8,
        status: "active",
      },
    }),
  ]);

  const complianceTypes = {
    driverCard: await prisma.complianceItemType.create({
      data: {
        organizationId: organization.id,
        entityType: "driver",
        code: "PRO_CARD",
        name: "Carte professionnelle chauffeur",
        validityDays: 365,
        isRequired: true,
      },
    }),
    driverMedical: await prisma.complianceItemType.create({
      data: {
        organizationId: organization.id,
        entityType: "driver",
        code: "MED_VISIT",
        name: "Visite médicale",
        validityDays: 365,
        isRequired: true,
      },
    }),
    vehicleInsurance: await prisma.complianceItemType.create({
      data: {
        organizationId: organization.id,
        entityType: "vehicle",
        code: "INSURANCE",
        name: "Assurance véhicule",
        validityDays: 365,
        isRequired: true,
      },
    }),
    vehicleInspection: await prisma.complianceItemType.create({
      data: {
        organizationId: organization.id,
        entityType: "vehicle",
        code: "TECH_INSPECTION",
        name: "Contrôle technique",
        validityDays: 365,
        isRequired: true,
      },
    }),
  };

  for (const driver of drivers) {
    await prisma.driverComplianceItem.createMany({
      data: [
        {
          driverId: driver.id,
          complianceTypeId: complianceTypes.driverCard.id,
          status: "valid",
          issuedAt: toDateOnly(addDays(new Date(), -90)),
          expiresAt: toDateOnly(addDays(new Date(), 275)),
          note: "Document vérifié",
        },
        {
          driverId: driver.id,
          complianceTypeId: complianceTypes.driverMedical.id,
          status: "valid",
          issuedAt: toDateOnly(addDays(new Date(), -30)),
          expiresAt: toDateOnly(addDays(new Date(), 335)),
          note: "Aptitude confirmée",
        },
      ],
    });
  }

  for (const vehicle of vehicles) {
    await prisma.vehicleComplianceItem.createMany({
      data: [
        {
          vehicleId: vehicle.id,
          complianceTypeId: complianceTypes.vehicleInsurance.id,
          status: "valid",
          issuedAt: toDateOnly(addDays(new Date(), -60)),
          expiresAt: toDateOnly(addDays(new Date(), 305)),
        },
        {
          vehicleId: vehicle.id,
          complianceTypeId: complianceTypes.vehicleInspection.id,
          status: "valid",
          issuedAt: toDateOnly(addDays(new Date(), -40)),
          expiresAt: toDateOnly(addDays(new Date(), 210)),
        },
      ],
    });
  }

  await prisma.maintenanceEvent.createMany({
    data: [
      {
        vehicleId: vehicles[0].id,
        eventType: "Révision 30 000 km",
        status: "planned",
        dueAt: addDays(new Date(), 12),
        mileageKm: 29800,
        notes: "Prévoir immobilisation 1/2 journée",
      },
      {
        vehicleId: vehicles[2].id,
        eventType: "Pneumatiques",
        status: "planned",
        dueAt: addDays(new Date(), 21),
        mileageKm: 45200,
        notes: "Contrôle usure avant départ saison haute",
      },
    ],
  });

  const clients = [] as Array<{ id: string; name: string }>;
  const primaryContactsByClient = new Map<string, string>();

  for (const [index, seed] of clientsSeed.entries()) {
    const client = await prisma.client.create({
      data: {
        organizationId: organization.id,
        code: `CLI-${String(index + 1).padStart(3, "0")}`,
        name: seed.name,
        legalName: `${seed.name} SAS`,
        email: seed.email,
        phone: seed.phone,
        paymentTermsDays: index % 3 === 0 ? 15 : 30,
        status: "active",
        notes: "Compte de démonstration généré automatiquement.",
      },
    });
    clients.push({ id: client.id, name: client.name });

    const contact = await prisma.clientContact.create({
      data: {
        clientId: client.id,
        firstName: ["Camille", "Thomas", "Sarah", "Louis", "Emma"][index % 5],
        lastName: ["Bernard", "Petit", "Robert", "Garcia", "Dubois"][index % 5],
        email: `contact${index + 1}@${ORG_SLUG}.test`,
        phone: `+33 6 40 40 40 ${String(index).padStart(2, "0")}`,
        jobTitle: index % 2 === 0 ? "Office manager" : "Responsable voyages",
        isPrimary: true,
      },
    });
    primaryContactsByClient.set(client.id, contact.id);

    await prisma.passenger.create({
      data: {
        organizationId: organization.id,
        clientId: client.id,
        firstName: ["Jean", "Lina", "Nicolas", "Amel", "Marc"][index % 5],
        lastName: ["Morel", "Diaz", "Nguyen", "Leroy", "Adam"][index % 5],
        email: `passager${index + 1}@${ORG_SLUG}.test`,
        phone: `+33 6 41 41 41 ${String(index).padStart(2, "0")}`,
        notes: "Passager VIP de démonstration.",
      },
    });

    await prisma.savedPlace.createMany({
      data: [
        {
          organizationId: organization.id,
          clientId: client.id,
          label: `${seed.name} - Siège`,
          address: `Adresse siège ${seed.city}`,
          city: seed.city,
          latitude: new Prisma.Decimal((48.8 + index * 0.01).toFixed(7)),
          longitude: new Prisma.Decimal((2.25 + index * 0.01).toFixed(7)),
        },
        {
          organizationId: organization.id,
          clientId: client.id,
          label: `${seed.name} - Adresse favorite`,
          address: `Adresse favorite ${seed.city}`,
          city: seed.city,
          latitude: new Prisma.Decimal((48.75 + index * 0.01).toFixed(7)),
          longitude: new Prisma.Decimal((2.3 + index * 0.01).toFixed(7)),
        },
      ],
    });
  }

  await prisma.notificationRule.createMany({
    data: [
      {
        organizationId: organization.id,
        code: "MISSION_ASSIGNED_SMS",
        triggerEvent: "mission.assigned",
        channel: "sms",
        templateCode: "driver-assigned",
        isActive: true,
      },
      {
        organizationId: organization.id,
        code: "INVOICE_SENT_EMAIL",
        triggerEvent: "invoice.sent",
        channel: "email",
        templateCode: "invoice-sent",
        isActive: true,
      },
    ],
  });

  const baseWeek = startOfWeekMondayUtc(new Date());
  const orders: Array<{
    id: string;
    number: number;
    clientId: string;
    missionId: string;
  }> = [];
  const statuses = [
    "completed",
    "closed",
    "invoiced",
    "paid",
    "driver_assigned",
    "driver_accepted",
    "confirmed",
  ];

  for (let index = 0; index < 20; index++) {
    const client = clients[index % clients.length];
    const route = routeTemplates[index % routeTemplates.length];
    const dayOffset = Math.floor(index / 3) - 1;
    const slotHour = 6 + ((index * 2) % 10);
    const pickupAt = addHours(addDays(baseWeek, dayOffset), slotHour);
    const missionStatus = statuses[index % statuses.length];
    const orderStatus =
      missionStatus === "paid" || missionStatus === "invoiced"
        ? "confirmed"
        : missionStatus === "closed"
          ? "confirmed"
          : missionStatus === "completed"
            ? "confirmed"
            : missionStatus;
    const serviceType =
      index % 4 === 0
        ? serviceTypes.airport
        : index % 5 === 0
          ? serviceTypes.hourly
          : serviceTypes.transfer;

    const order = await prisma.order.create({
      data: {
        organizationId: organization.id,
        clientId: client.id,
        legalEntityId: legalEntity.id,
        clientContactId: primaryContactsByClient.get(client.id),
        serviceTypeId: serviceType.id,
        channel: index % 2 === 0 ? "phone" : "portal",
        externalReference: `ORD-${new Date().getUTCFullYear()}-${String(index + 1).padStart(4, "0")}`,
        status: orderStatus,
        internalNotes:
          index % 6 === 0
            ? "Client VIP – priorité élevée."
            : "Commande de démonstration.",
      },
    });

    const mission = await prisma.mission.create({
      data: {
        organizationId: organization.id,
        orderId: order.id,
        label: route.label,
        pickupAt,
        status: missionStatus,
        serviceTypeId: serviceType.id,
        passengerCount: index % 5 === 0 ? 4 : 2,
        luggageCount: index % 4 === 0 ? 4 : 2,
        estimatedDistanceKm: route.distanceKm,
        estimatedPrice: route.price,
        notes:
          index % 7 === 0
            ? "Meet & greet avec pancarte."
            : "Mission générée pour les tests de planning.",
        stops: {
          create: [
            {
              sequence: 1,
              type: "pickup",
              scheduledAt: pickupAt,
              address: route.pickupAddress,
              note: "Point de prise en charge",
            },
            {
              sequence: 2,
              type: "dropoff",
              scheduledAt: addMinutes(pickupAt, route.durationMinutes),
              address: route.dropoffAddress,
              note: "Point de dépose",
            },
          ],
        },
      },
    });

    orders.push({
      id: order.id,
      number: index + 1,
      clientId: client.id,
      missionId: mission.id,
    });

    if (
      [
        "driver_assigned",
        "driver_accepted",
        "completed",
        "closed",
        "invoiced",
        "paid",
      ].includes(missionStatus)
    ) {
      const driver = drivers[index % drivers.length];
      const vehicle = vehicles[index % vehicles.length];
      await prisma.missionAssignment.create({
        data: {
          missionId: mission.id,
          driverId: driver.id,
          vehicleId: vehicle.id,
          assignmentMode: index % 2 === 0 ? "manual" : "auto",
          status: missionStatus === "driver_accepted" ? "accepted" : "assigned",
          assignedAt: addMinutes(pickupAt, -90),
        },
      });
    }

    if (["completed", "closed", "invoiced", "paid"].includes(missionStatus)) {
      const driver = drivers[index % drivers.length];
      await prisma.missionExpense.create({
        data: {
          missionId: mission.id,
          driverId: driver.id,
          expenseType: "parking",
          amount: money(8 + (index % 3) * 2),
          currency: "EUR",
          occurredAt: addMinutes(pickupAt, 30),
          note: "Frais parking démo",
        },
      });

      if (index % 2 === 0) {
        await prisma.missionCashCollection.create({
          data: {
            missionId: mission.id,
            driverId: driver.id,
            amount: money(30 + index),
            currency: "EUR",
            paymentMethod: "cash",
            collectedAt: addMinutes(pickupAt, 45),
            note: "Encaissement de démonstration",
          },
        });
      }
    }

    if (index % 8 === 0) {
      const driver = drivers[index % drivers.length];
      await prisma.missionIncident.create({
        data: {
          missionId: mission.id,
          driverId: driver.id,
          incidentType: "delay",
          status: "resolved",
          description: "Retard circulation dense sur le périphérique.",
          occurredAt: addMinutes(pickupAt, -10),
        },
      });
    }

    if (index % 5 === 0) {
      await prisma.notification.create({
        data: {
          organizationId: organization.id,
          clientId: client.id,
          orderId: order.id,
          missionId: mission.id,
          channel: index % 2 === 0 ? "sms" : "email",
          notificationType: "mission_confirmation",
          status: "sent",
          recipient: `ops+${index + 1}@waydemo.test`,
          subject: `Confirmation mission ${order.externalReference}`,
          body: `Votre mission ${route.label} est confirmée pour le ${pickupAt.toISOString()}.`,
          sentAt: addMinutes(pickupAt, -120),
        },
      });
    }

    if (serviceType.code === "AIRPORT") {
      await prisma.flightSegment.create({
        data: {
          missionId: mission.id,
          flightNumber: `AF${1200 + index}`,
          airportCode: index % 2 === 0 ? "CDG" : "ORY",
          terminal: index % 2 === 0 ? "2E" : "3",
          airlineCode: "AF",
          scheduledAt: addMinutes(pickupAt, -30),
          status: "scheduled",
        },
      });
    }
  }

  for (let index = 0; index < 5; index++) {
    const linkedOrder = orders[index];
    const amount = 120 + index * 20;
    await prisma.quote.create({
      data: {
        organizationId: organization.id,
        orderId: linkedOrder.id,
        clientId: linkedOrder.clientId,
        legalEntityId: legalEntity.id,
        number: `DEVIS-${new Date().getUTCFullYear()}-${String(index + 1).padStart(3, "0")}`,
        status: index < 3 ? "accepted" : "sent",
        issueDate: toDateOnly(addDays(new Date(), -(10 - index))),
        validUntil: toDateOnly(addDays(new Date(), 15 + index)),
        subtotal: money(amount),
        taxAmount: money(amount * 0.1),
        totalAmount: money(amount * 1.1),
        notes: "Devis de démonstration",
        lines: {
          create: [
            {
              sequence: 1,
              label: "Transfert premium",
              quantity: money(1),
              unitPrice: money(amount - 20),
              taxRate: money(10),
              totalAmount: money(amount - 20),
            },
            {
              sequence: 2,
              label: "Supplément attente / bagages",
              quantity: money(1),
              unitPrice: money(20),
              taxRate: money(10),
              totalAmount: money(20),
            },
          ],
        },
      },
    });
  }

  const invoiceSpecs = [
    { amount: 154, paid: 154, status: "paid" },
    { amount: 198, paid: 120, status: "issued" },
    { amount: 242, paid: 0, status: "issued" },
    { amount: 176, paid: 176, status: "paid" },
  ];

  for (const [index, spec] of invoiceSpecs.entries()) {
    const linkedOrder = orders[index];
    const subtotal = spec.amount / 1.1;
    const invoice = await prisma.invoice.create({
      data: {
        organizationId: organization.id,
        orderId: linkedOrder.id,
        clientId: linkedOrder.clientId,
        legalEntityId: legalEntity.id,
        number: `FACT-${new Date().getUTCFullYear()}-${String(index + 1).padStart(3, "0")}`,
        status: spec.status,
        issueDate: toDateOnly(addDays(new Date(), -(7 - index))),
        dueDate: toDateOnly(addDays(new Date(), 14 + index)),
        subtotal: money(subtotal),
        taxAmount: money(spec.amount - subtotal),
        totalAmount: money(spec.amount),
        outstandingAmount: money(spec.amount - spec.paid),
        notes: "Facture de démonstration",
        lines: {
          create: [
            {
              sequence: 1,
              label: "Prestation transport avec chauffeur",
              quantity: money(1),
              unitPrice: money(subtotal),
              taxRate: money(10),
              totalAmount: money(subtotal),
            },
          ],
        },
      },
      include: { payments: true },
    });

    if (spec.paid > 0) {
      await prisma.payment.create({
        data: {
          organizationId: organization.id,
          invoiceId: invoice.id,
          amount: money(spec.paid),
          currency: "EUR",
          paymentMethod: index % 2 === 0 ? "bank_transfer" : "credit_card",
          paymentDate: toDateOnly(addDays(new Date(), -(2 - index))),
          reference: `PMT-${index + 1}`,
          status: "received",
        },
      });
    }
  }

  await prisma.reservationRequest.createMany({
    data: [
      {
        organizationId: organization.id,
        clientId: clients[0].id,
        customerName: "Réception Hôtel Le Grand Paris",
        email: "late-booking@grandparis.test",
        phone: "+33 1 40 10 10 10",
        pickupAddress: "Aéroport CDG Terminal 2F",
        dropoffAddress: "Hôtel Le Grand Paris, 75009 Paris",
        pickupAt: addHours(addDays(baseWeek, 2), 16),
        passengerCount: 2,
        notes: "Demande créée depuis le portail",
        status: "new",
      },
      {
        organizationId: organization.id,
        customerName: "Wedding planner Premium Weddings",
        email: "urgent@premiumweddings.test",
        phone: "+33 1 48 88 88 88",
        pickupAddress: "8 Avenue de Breteuil, 75007 Paris",
        dropoffAddress: "Château de Versailles",
        pickupAt: addHours(addDays(baseWeek, 4), 11),
        passengerCount: 6,
        notes: "Nécessite un van",
        status: "quoted",
      },
    ],
  });

  await prisma.portalAccessToken.create({
    data: {
      clientId: clients[0].id,
      token: "demo-portal-access-token",
      expiresAt: addDays(new Date(), 14),
      isUsed: false,
    },
  });

  await prisma.kpiSnapshotDaily.createMany({
    data: Array.from({ length: 7 }).flatMap((_, index) => {
      const date = toDateOnly(addDays(baseWeek, index));
      return [
        {
          organizationId: organization.id,
          snapshotDate: date,
          metricKey: "orders_count",
          metricValue: money(8 + index),
          metaJson: { dayOffset: index },
        },
        {
          organizationId: organization.id,
          snapshotDate: date,
          metricKey: "revenue_amount",
          metricValue: money(520 + index * 70),
          metaJson: { currency: "EUR" },
        },
      ];
    }),
  });

  await prisma.searchIndexEntry.createMany({
    data: [
      ...clients.slice(0, 5).map((client) => ({
        organizationId: organization.id,
        entityType: "client",
        entityId: client.id,
        title: client.name,
        subtitle: "Client entreprise",
        searchableText: `${client.name} client entreprise démo`,
      })),
      ...orders.slice(0, 8).map((order) => ({
        organizationId: organization.id,
        entityType: "order",
        entityId: order.id,
        title: `Commande #${String(order.number).padStart(4, "0")}`,
        subtitle: "Ordre de transport",
        searchableText: `commande transport mission ${order.id}`,
      })),
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: organization.id,
        userId: adminUser.id,
        entityType: "organization",
        entityId: organization.id,
        action: "seed.created",
        metaJson: { source: "prisma.seed.ts" },
        ipAddress: "127.0.0.1",
        userAgent: "prisma-seed",
      },
      {
        organizationId: organization.id,
        userId: dispatcherUser.id,
        entityType: "planning",
        action: "seed.initialized",
        metaJson: {
          orders: orders.length,
          drivers: drivers.length,
          vehicles: vehicles.length,
        },
        ipAddress: "127.0.0.1",
        userAgent: "prisma-seed",
      },
    ],
  });

  console.log("✅ Seeds créées avec succès.");
  console.log(
    JSON.stringify(
      {
        organization: ORG_NAME,
        users: 5,
        drivers: drivers.length,
        vehicles: vehicles.length,
        clients: clients.length,
        orders: orders.length,
        quotes: 5,
        invoices: invoiceSpecs.length,
        demoCredentials: DEMO_CREDENTIALS,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed Prisma en échec");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
