import { createHash } from "crypto";

/** Simple SHA-256 hash for passwords. */
export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "ctv_salt_2025").digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export interface SessionData {
  userId: number;
  role: "customer" | "staff" | "admin";
  email: string;
  name: string;
  companyName?: string | null;
}
