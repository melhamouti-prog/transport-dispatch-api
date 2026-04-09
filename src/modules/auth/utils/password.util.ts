import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const hashSecret = async (secret: string) => {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scryptAsync(secret, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
};

export const verifySecret = async (
  secret: string,
  storedHash?: string | null,
) => {
  if (!storedHash) {
    return false;
  }

  if (!storedHash.startsWith("scrypt$")) {
    return safeCompare(secret, storedHash);
  }

  const [, salt, expectedHash] = storedHash.split("$");
  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = (await scryptAsync(secret, salt, KEY_LENGTH)) as Buffer;
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedBuffer);
};
