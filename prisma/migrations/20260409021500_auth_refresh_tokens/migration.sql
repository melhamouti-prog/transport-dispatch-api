-- AlterTable
ALTER TABLE "users"
ADD COLUMN "refreshTokenHash" VARCHAR(255),
ADD COLUMN "refreshTokenExpiresAt" TIMESTAMPTZ(6);
