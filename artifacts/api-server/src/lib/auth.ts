import bcrypt from "bcryptjs";

const ROUNDS = 10;

/**
 * Hash a password with bcrypt. Each call produces a different hash because
 * bcrypt embeds a per-password random salt, so identical passwords do not
 * share a hash and precomputed tables are useless.
 */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionData {
  userId: number;
  role: "customer" | "staff" | "admin";
  email: string;
  name: string;
  companyName?: string | null;
}
