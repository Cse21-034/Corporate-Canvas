import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, staffTable, customersTable } from "@workspace/db";
import { hashPassword, verifyPassword } from "../lib/auth";
import { setSession, getSession, clearSession } from "../lib/session";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    res.status(400).json({ error: "email, password and role are required" });
    return;
  }

  if (role === "staff") {
    const [staff] = await db.select().from(staffTable).where(eq(staffTable.email, email));
    if (!staff || !verifyPassword(password, staff.passwordHash)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    setSession(res, {
      userId: staff.id,
      role: staff.role as "staff" | "admin",
      email: staff.email,
      name: staff.name,
    });
    res.json({ id: staff.id, email: staff.email, name: staff.name, role: staff.role, companyName: null });
    return;
  }

  if (role === "customer") {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.email, email));
    if (!customer || !verifyPassword(password, customer.passwordHash)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    setSession(res, {
      userId: customer.id,
      role: "customer",
      email: customer.email,
      name: customer.contactName,
      companyName: customer.companyName,
    });
    res.json({ id: customer.id, email: customer.email, name: customer.contactName, role: "customer", companyName: customer.companyName });
    return;
  }

  res.status(400).json({ error: "Invalid role" });
});

router.post("/auth/logout", (req, res): void => {
  clearSession(res);
  res.sendStatus(204);
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (session.role === "customer") {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, session.userId));
    if (!customer) {
      res.status(401).json({ error: "Session invalid" });
      return;
    }
    res.json({ id: customer.id, email: customer.email, name: customer.contactName, role: "customer", companyName: customer.companyName });
    return;
  }

  const [staff] = await db.select().from(staffTable).where(eq(staffTable.id, session.userId));
  if (!staff) {
    res.status(401).json({ error: "Session invalid" });
    return;
  }
  res.json({ id: staff.id, email: staff.email, name: staff.name, role: staff.role, companyName: null });
});

export default router;
