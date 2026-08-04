import type { Request, Response } from "express";
import { createHmac } from "crypto";

const SECRET = process.env.SESSION_SECRET || "ctv_default_secret";
const COOKIE_NAME = "ctv_session";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  userId: number;
  role: "customer" | "staff" | "admin";
  email: string;
  name: string;
  companyName?: string | null;
}

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function setSession(res: Response, payload: SessionPayload): void {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(encoded);
  // In production the API and the frontend are on different sites (Render vs
  // Vercel), so the cookie has to be SameSite=None or the browser won't send
  // it with cross-site requests. SameSite=None requires Secure.
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, `${encoded}.${sig}`, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: MAX_AGE,
  });
}

export function getSession(req: Request): SessionPayload | null {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return null;
  const encoded = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (sign(encoded) !== sig) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSession(res: Response): void {
  res.clearCookie(COOKIE_NAME);
}
