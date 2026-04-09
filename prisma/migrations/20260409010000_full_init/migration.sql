-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "defaultCurrency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "defaultTimezone" VARCHAR(50) NOT NULL DEFAULT 'Europe/Paris',
    "locale" VARCHAR(10) NOT NULL DEFAULT 'fr-FR',
    "settingsJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "organizationId" UUID,
    "storageProvider" VARCHAR(50) NOT NULL,
    "storageKey" VARCHAR(255) NOT NULL,
    "originalFilename" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(120) NOT NULL,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "checksumSha256" VARCHAR(64),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "organizationId" UUID,
    "label" VARCHAR(150),
    "line1" VARCHAR(150),
    "line2" VARCHAR(150),
    "postalCode" VARCHAR(20),
    "city" VARCHAR(100),
    "region" VARCHAR(100),
    "countryCode" VARCHAR(2),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isAirport" BOOLEAN NOT NULL DEFAULT false,
    "airportIata" VARCHAR(3),
    "placeId" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_entities" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(50),
    "registrationNumber" VARCHAR(80),
    "vatNumber" VARCHAR(80),
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "addressId" UUID,
    "logoFileId" UUID,
    "invoicePrefix" VARCHAR(20),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "legal_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(190) NOT NULL,
    "phone" VARCHAR(50),
    "passwordHash" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "lastLoginAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID,
    "entityType" VARCHAR(80) NOT NULL,
    "entityId" UUID,
    "action" VARCHAR(80) NOT NULL,
    "metaJson" JSONB,
    "ipAddress" VARCHAR(64),
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(150) NOT NULL,
    "legalName" VARCHAR(150),
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "billingAddressId" UUID,
    "externalReference" VARCHAR(120),
    "paymentTermsDays" INTEGER DEFAULT 30,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_contacts" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "jobTitle" VARCHAR(100),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "client_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clientId" UUID,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_places" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clientId" UUID,
    "label" VARCHAR(150) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "saved_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "legalName" VARCHAR(150),
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "partnerId" UUID,
    "userId" UUID,
    "code" VARCHAR(50),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "licenseNumber" VARCHAR(80),
    "professionalCardNumber" VARCHAR(80),
    "professionalCardExpiry" TIMESTAMPTZ(6),
    "medicalVisitExpiry" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_categories" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "seats" INTEGER,
    "luggageCount" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vehicle_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "partnerId" UUID,
    "categoryId" UUID,
    "registrationNumber" VARCHAR(50) NOT NULL,
    "label" VARCHAR(100),
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "color" VARCHAR(50),
    "seats" INTEGER,
    "luggageCount" INTEGER,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_types" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "service_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(100) NOT NULL,
    "zoneType" VARCHAR(50),
    "metaJson" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_profiles" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tariff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_rules" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "serviceTypeId" UUID,
    "zoneId" UUID,
    "billingMode" VARCHAR(50) NOT NULL DEFAULT 'flat',
    "amount" DECIMAL(12,2) NOT NULL,
    "vatRate" DECIMAL(5,2),
    "minDistanceKm" DECIMAL(10,2),
    "maxDistanceKm" DECIMAL(10,2),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tariff_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "legalEntityId" UUID,
    "clientContactId" UUID,
    "serviceTypeId" UUID,
    "channel" VARCHAR(50),
    "externalReference" VARCHAR(120),
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "orderId" UUID,
    "label" VARCHAR(180) NOT NULL,
    "pickupAt" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "serviceTypeId" UUID,
    "passengerCount" INTEGER,
    "luggageCount" INTEGER,
    "estimatedDistanceKm" DOUBLE PRECISION,
    "estimatedPrice" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_stops" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "scheduledAt" TIMESTAMPTZ(6) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mission_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_assignments" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "vehicleId" UUID,
    "assignmentMode" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL DEFAULT 'assigned',
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mission_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_expenses" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "driverId" UUID,
    "expenseType" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "occurredAt" TIMESTAMPTZ(6) NOT NULL,
    "note" TEXT,
    "receiptFileId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mission_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_incidents" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "driverId" UUID,
    "incidentType" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'open',
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mission_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_cash_collections" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "driverId" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "paymentMethod" VARCHAR(50),
    "collectedAt" TIMESTAMPTZ(6) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mission_cash_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_segments" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "flightNumber" VARCHAR(20) NOT NULL,
    "airportCode" VARCHAR(3),
    "terminal" VARCHAR(20),
    "airlineCode" VARCHAR(10),
    "scheduledAt" TIMESTAMPTZ(6),
    "actualAt" TIMESTAMPTZ(6),
    "status" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "flight_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "orderId" UUID,
    "clientId" UUID NOT NULL,
    "legalEntityId" UUID,
    "number" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "issueDate" DATE NOT NULL,
    "validUntil" DATE,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_lines" (
    "id" UUID NOT NULL,
    "quoteId" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "taxRate" DECIMAL(5,2),
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "quote_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "orderId" UUID,
    "clientId" UUID NOT NULL,
    "legalEntityId" UUID,
    "number" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "issueDate" DATE NOT NULL,
    "dueDate" DATE,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "outstandingAmount" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_lines" (
    "id" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "taxRate" DECIMAL(5,2),
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "paymentMethod" VARCHAR(50),
    "paymentDate" DATE NOT NULL,
    "reference" VARCHAR(120),
    "status" VARCHAR(50) NOT NULL DEFAULT 'received',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_requests" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clientId" UUID,
    "customerName" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(50),
    "pickupAddress" VARCHAR(255) NOT NULL,
    "dropoffAddress" VARCHAR(255) NOT NULL,
    "pickupAt" TIMESTAMPTZ(6) NOT NULL,
    "passengerCount" INTEGER,
    "notes" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reservation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clientId" UUID,
    "orderId" UUID,
    "missionId" UUID,
    "channel" VARCHAR(50) NOT NULL,
    "notificationType" VARCHAR(80) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "recipient" VARCHAR(190),
    "subject" VARCHAR(255),
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMPTZ(6),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_rules" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "triggerEvent" VARCHAR(80) NOT NULL,
    "channel" VARCHAR(50) NOT NULL,
    "templateCode" VARCHAR(80),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notification_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_item_types" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "entityType" VARCHAR(20) NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(150) NOT NULL,
    "validityDays" INTEGER,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "compliance_item_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_compliance_items" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "complianceTypeId" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'valid',
    "issuedAt" DATE,
    "expiresAt" DATE,
    "documentFileId" UUID,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "driver_compliance_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_compliance_items" (
    "id" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "complianceTypeId" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'valid',
    "issuedAt" DATE,
    "expiresAt" DATE,
    "documentFileId" UUID,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vehicle_compliance_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_events" (
    "id" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "eventType" VARCHAR(80) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'planned',
    "dueAt" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "mileageKm" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "maintenance_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_access_tokens" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "portal_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_snapshots_daily" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "metricKey" VARCHAR(80) NOT NULL,
    "metricValue" DECIMAL(14,2) NOT NULL,
    "metaJson" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "kpi_snapshots_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_index_entries" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "entityType" VARCHAR(80) NOT NULL,
    "entityId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" TEXT,
    "searchableText" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "search_index_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "files_organizationId_mimeType_idx" ON "files"("organizationId", "mimeType");

-- CreateIndex
CREATE INDEX "addresses_organizationId_city_idx" ON "addresses"("organizationId", "city");

-- CreateIndex
CREATE INDEX "addresses_airportIata_idx" ON "addresses"("airportIata");

-- CreateIndex
CREATE INDEX "legal_entities_organizationId_name_idx" ON "legal_entities"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organizationId_status_idx" ON "users"("organizationId", "status");

-- CreateIndex
CREATE INDEX "roles_organizationId_name_idx" ON "roles"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organizationId_code_key" ON "roles"("organizationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_organizationId_userId_roleId_key" ON "user_roles"("organizationId", "userId", "roleId");

-- CreateIndex
CREATE INDEX "audit_logs_organizationId_entityType_entityId_idx" ON "audit_logs"("organizationId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "clients_organizationId_name_idx" ON "clients"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_organizationId_code_key" ON "clients"("organizationId", "code");

-- CreateIndex
CREATE INDEX "client_contacts_clientId_isPrimary_idx" ON "client_contacts"("clientId", "isPrimary");

-- CreateIndex
CREATE INDEX "passengers_organizationId_lastName_idx" ON "passengers"("organizationId", "lastName");

-- CreateIndex
CREATE INDEX "passengers_clientId_idx" ON "passengers"("clientId");

-- CreateIndex
CREATE INDEX "saved_places_organizationId_label_idx" ON "saved_places"("organizationId", "label");

-- CreateIndex
CREATE INDEX "saved_places_clientId_idx" ON "saved_places"("clientId");

-- CreateIndex
CREATE INDEX "partners_organizationId_name_idx" ON "partners"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");

-- CreateIndex
CREATE INDEX "drivers_organizationId_status_idx" ON "drivers"("organizationId", "status");

-- CreateIndex
CREATE INDEX "drivers_partnerId_idx" ON "drivers"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_organizationId_code_key" ON "drivers"("organizationId", "code");

-- CreateIndex
CREATE INDEX "vehicle_categories_organizationId_name_idx" ON "vehicle_categories"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_categories_organizationId_code_key" ON "vehicle_categories"("organizationId", "code");

-- CreateIndex
CREATE INDEX "vehicles_organizationId_status_idx" ON "vehicles"("organizationId", "status");

-- CreateIndex
CREATE INDEX "vehicles_partnerId_idx" ON "vehicles"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_organizationId_registrationNumber_key" ON "vehicles"("organizationId", "registrationNumber");

-- CreateIndex
CREATE INDEX "service_types_organizationId_name_idx" ON "service_types"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_organizationId_code_key" ON "service_types"("organizationId", "code");

-- CreateIndex
CREATE INDEX "zones_organizationId_name_idx" ON "zones"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "zones_organizationId_code_key" ON "zones"("organizationId", "code");

-- CreateIndex
CREATE INDEX "tariff_profiles_organizationId_name_idx" ON "tariff_profiles"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_profiles_organizationId_code_key" ON "tariff_profiles"("organizationId", "code");

-- CreateIndex
CREATE INDEX "tariff_rules_organizationId_profileId_idx" ON "tariff_rules"("organizationId", "profileId");

-- CreateIndex
CREATE INDEX "tariff_rules_serviceTypeId_idx" ON "tariff_rules"("serviceTypeId");

-- CreateIndex
CREATE INDEX "tariff_rules_zoneId_idx" ON "tariff_rules"("zoneId");

-- CreateIndex
CREATE INDEX "orders_organizationId_status_createdAt_idx" ON "orders"("organizationId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "orders_clientId_createdAt_idx" ON "orders"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "missions_organizationId_pickupAt_idx" ON "missions"("organizationId", "pickupAt");

-- CreateIndex
CREATE INDEX "missions_orderId_idx" ON "missions"("orderId");

-- CreateIndex
CREATE INDEX "missions_status_pickupAt_idx" ON "missions"("status", "pickupAt");

-- CreateIndex
CREATE INDEX "mission_stops_missionId_sequence_idx" ON "mission_stops"("missionId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "mission_assignments_missionId_key" ON "mission_assignments"("missionId");

-- CreateIndex
CREATE INDEX "mission_assignments_driverId_assignedAt_idx" ON "mission_assignments"("driverId", "assignedAt");

-- CreateIndex
CREATE INDEX "mission_assignments_vehicleId_assignedAt_idx" ON "mission_assignments"("vehicleId", "assignedAt");

-- CreateIndex
CREATE INDEX "mission_expenses_missionId_occurredAt_idx" ON "mission_expenses"("missionId", "occurredAt");

-- CreateIndex
CREATE INDEX "mission_expenses_driverId_idx" ON "mission_expenses"("driverId");

-- CreateIndex
CREATE INDEX "mission_incidents_missionId_occurredAt_idx" ON "mission_incidents"("missionId", "occurredAt");

-- CreateIndex
CREATE INDEX "mission_cash_collections_missionId_collectedAt_idx" ON "mission_cash_collections"("missionId", "collectedAt");

-- CreateIndex
CREATE INDEX "flight_segments_missionId_flightNumber_idx" ON "flight_segments"("missionId", "flightNumber");

-- CreateIndex
CREATE INDEX "quotes_clientId_issueDate_idx" ON "quotes"("clientId", "issueDate");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_organizationId_number_key" ON "quotes"("organizationId", "number");

-- CreateIndex
CREATE INDEX "quote_lines_quoteId_sequence_idx" ON "quote_lines"("quoteId", "sequence");

-- CreateIndex
CREATE INDEX "invoices_clientId_issueDate_idx" ON "invoices"("clientId", "issueDate");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_organizationId_number_key" ON "invoices"("organizationId", "number");

-- CreateIndex
CREATE INDEX "invoice_lines_invoiceId_sequence_idx" ON "invoice_lines"("invoiceId", "sequence");

-- CreateIndex
CREATE INDEX "payments_organizationId_paymentDate_idx" ON "payments"("organizationId", "paymentDate");

-- CreateIndex
CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");

-- CreateIndex
CREATE INDEX "reservation_requests_organizationId_status_pickupAt_idx" ON "reservation_requests"("organizationId", "status", "pickupAt");

-- CreateIndex
CREATE INDEX "reservation_requests_clientId_idx" ON "reservation_requests"("clientId");

-- CreateIndex
CREATE INDEX "notifications_organizationId_status_createdAt_idx" ON "notifications"("organizationId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_orderId_idx" ON "notifications"("orderId");

-- CreateIndex
CREATE INDEX "notifications_missionId_idx" ON "notifications"("missionId");

-- CreateIndex
CREATE INDEX "notification_rules_organizationId_triggerEvent_idx" ON "notification_rules"("organizationId", "triggerEvent");

-- CreateIndex
CREATE UNIQUE INDEX "notification_rules_organizationId_code_key" ON "notification_rules"("organizationId", "code");

-- CreateIndex
CREATE INDEX "compliance_item_types_organizationId_entityType_idx" ON "compliance_item_types"("organizationId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_item_types_organizationId_code_key" ON "compliance_item_types"("organizationId", "code");

-- CreateIndex
CREATE INDEX "driver_compliance_items_driverId_expiresAt_idx" ON "driver_compliance_items"("driverId", "expiresAt");

-- CreateIndex
CREATE INDEX "vehicle_compliance_items_vehicleId_expiresAt_idx" ON "vehicle_compliance_items"("vehicleId", "expiresAt");

-- CreateIndex
CREATE INDEX "maintenance_events_vehicleId_dueAt_idx" ON "maintenance_events"("vehicleId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "portal_access_tokens_token_key" ON "portal_access_tokens"("token");

-- CreateIndex
CREATE INDEX "portal_access_tokens_clientId_expiresAt_idx" ON "portal_access_tokens"("clientId", "expiresAt");

-- CreateIndex
CREATE INDEX "kpi_snapshots_daily_organizationId_snapshotDate_idx" ON "kpi_snapshots_daily"("organizationId", "snapshotDate");

-- CreateIndex
CREATE INDEX "search_index_entries_organizationId_entityType_idx" ON "search_index_entries"("organizationId", "entityType");

-- CreateIndex
CREATE INDEX "search_index_entries_organizationId_entityId_idx" ON "search_index_entries"("organizationId", "entityId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_entities" ADD CONSTRAINT "legal_entities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_categories" ADD CONSTRAINT "vehicle_categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "vehicle_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_types" ADD CONSTRAINT "service_types_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_profiles" ADD CONSTRAINT "tariff_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_rules" ADD CONSTRAINT "tariff_rules_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_rules" ADD CONSTRAINT "tariff_rules_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "tariff_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_rules" ADD CONSTRAINT "tariff_rules_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "service_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_rules" ADD CONSTRAINT "tariff_rules_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_legalEntityId_fkey" FOREIGN KEY ("legalEntityId") REFERENCES "legal_entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientContactId_fkey" FOREIGN KEY ("clientContactId") REFERENCES "client_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "service_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "service_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_stops" ADD CONSTRAINT "mission_stops_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_assignments" ADD CONSTRAINT "mission_assignments_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_assignments" ADD CONSTRAINT "mission_assignments_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_assignments" ADD CONSTRAINT "mission_assignments_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_expenses" ADD CONSTRAINT "mission_expenses_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_expenses" ADD CONSTRAINT "mission_expenses_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_incidents" ADD CONSTRAINT "mission_incidents_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_incidents" ADD CONSTRAINT "mission_incidents_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_cash_collections" ADD CONSTRAINT "mission_cash_collections_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_cash_collections" ADD CONSTRAINT "mission_cash_collections_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_segments" ADD CONSTRAINT "flight_segments_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_legalEntityId_fkey" FOREIGN KEY ("legalEntityId") REFERENCES "legal_entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_lines" ADD CONSTRAINT "quote_lines_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_legalEntityId_fkey" FOREIGN KEY ("legalEntityId") REFERENCES "legal_entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_requests" ADD CONSTRAINT "reservation_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_requests" ADD CONSTRAINT "reservation_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_rules" ADD CONSTRAINT "notification_rules_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_item_types" ADD CONSTRAINT "compliance_item_types_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_compliance_items" ADD CONSTRAINT "driver_compliance_items_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_compliance_items" ADD CONSTRAINT "driver_compliance_items_complianceTypeId_fkey" FOREIGN KEY ("complianceTypeId") REFERENCES "compliance_item_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_compliance_items" ADD CONSTRAINT "vehicle_compliance_items_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_compliance_items" ADD CONSTRAINT "vehicle_compliance_items_complianceTypeId_fkey" FOREIGN KEY ("complianceTypeId") REFERENCES "compliance_item_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_events" ADD CONSTRAINT "maintenance_events_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_access_tokens" ADD CONSTRAINT "portal_access_tokens_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_snapshots_daily" ADD CONSTRAINT "kpi_snapshots_daily_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_index_entries" ADD CONSTRAINT "search_index_entries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

