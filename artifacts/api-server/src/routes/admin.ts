import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, quoteRequestsTable, customersTable, projectsTable, ticketsTable, invoicesTable, servicesTable } from "@workspace/db";
import { getSession } from "../lib/session";
import { hashPassword } from "../lib/auth";

const router: IRouter = Router();

function requireStaff(req: any, res: any, next: any): void {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (session.role === "customer") {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  req.session = session;
  next();
}

router.get("/admin/quote-requests", requireStaff, async (_req, res): Promise<void> => {
  const quotes = await db.select().from(quoteRequestsTable).orderBy(desc(quoteRequestsTable.createdAt));
  res.json(quotes.map(q => ({ ...q, createdAt: q.createdAt.toISOString() })));
});

router.patch("/admin/quote-requests/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }
  const [record] = await db.update(quoteRequestsTable).set({ status }).where(eq(quoteRequestsTable.id, id)).returning();
  if (!record) {
    res.status(404).json({ error: "Quote request not found" });
    return;
  }
  res.json({ ...record, createdAt: record.createdAt.toISOString() });
});

router.patch("/admin/services/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { imageUrl } = req.body;

  // An empty string clears the image; undefined means "not supplied".
  if (imageUrl === undefined) {
    res.status(400).json({ error: "imageUrl is required" });
    return;
  }
  const value = typeof imageUrl === "string" && imageUrl.trim() !== "" ? imageUrl.trim() : null;
  if (value !== null && !/^https?:\/\//i.test(value)) {
    res.status(400).json({ error: "imageUrl must be an http(s) URL" });
    return;
  }

  const [record] = await db.update(servicesTable).set({ imageUrl: value }).where(eq(servicesTable.id, id)).returning();
  if (!record) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(record);
});

router.get("/admin/customers", requireStaff, async (_req, res): Promise<void> => {
  const customers = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
  res.json(customers.map(c => ({ id: c.id, companyName: c.companyName, contactName: c.contactName, email: c.email, phone: c.phone, status: c.status, createdAt: c.createdAt.toISOString() })));
});

router.post("/admin/customers", requireStaff, async (req, res): Promise<void> => {
  const { companyName, contactName, email, password, phone, status } = req.body ?? {};

  if (!companyName || !contactName || !email || !password) {
    res.status(400).json({ error: "companyName, contactName, email and password are required" });
    return;
  }

  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "password must be at least 8 characters" });
    return;
  }

  const normalisedEmail = String(email).trim().toLowerCase();

  const [existing] = await db.select().from(customersTable).where(eq(customersTable.email, normalisedEmail));
  if (existing) {
    res.status(409).json({ error: "A customer with that email already exists" });
    return;
  }

  const [record] = await db
    .insert(customersTable)
    .values({
      companyName,
      contactName,
      email: normalisedEmail,
      passwordHash: await hashPassword(password),
      phone: phone ?? "",
      status: status ?? "active",
    })
    .returning();

  // Never return the password hash.
  res.status(201).json({
    id: record.id,
    companyName: record.companyName,
    contactName: record.contactName,
    email: record.email,
    phone: record.phone,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
  });
});

router.get("/admin/projects", requireStaff, async (_req, res): Promise<void> => {
  const projects = await db.select({
    id: projectsTable.id,
    title: projectsTable.title,
    description: projectsTable.description,
    status: projectsTable.status,
    customerId: projectsTable.customerId,
    customerName: customersTable.companyName,
    milestones: projectsTable.milestones,
    startDate: projectsTable.startDate,
    targetDate: projectsTable.targetDate,
    createdAt: projectsTable.createdAt,
  }).from(projectsTable)
    .leftJoin(customersTable, eq(projectsTable.customerId, customersTable.id))
    .orderBy(desc(projectsTable.createdAt));
  res.json(projects.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
});

router.post("/admin/projects", requireStaff, async (req, res): Promise<void> => {
  const { title, description, customerId, status, milestones, startDate, targetDate } = req.body;
  if (!title || !description || !customerId) {
    res.status(400).json({ error: "title, description, customerId are required" });
    return;
  }
  const [project] = await db.insert(projectsTable).values({
    title,
    description,
    customerId: parseInt(String(customerId), 10),
    status: status || "scoping",
    milestones: milestones || [],
    startDate: startDate || null,
    targetDate: targetDate || null,
  }).returning();
  res.status(201).json({ ...project, customerName: null, createdAt: project.createdAt.toISOString() });
});

router.patch("/admin/projects/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { title, description, status, milestones, targetDate } = req.body;
  const updates: any = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (status) updates.status = status;
  if (milestones) updates.milestones = milestones;
  if (targetDate !== undefined) updates.targetDate = targetDate;
  const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, id)).returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ ...project, customerName: null, createdAt: project.createdAt.toISOString() });
});

router.get("/admin/tickets", requireStaff, async (_req, res): Promise<void> => {
  const tickets = await db.select({
    id: ticketsTable.id,
    subject: ticketsTable.subject,
    type: ticketsTable.type,
    priority: ticketsTable.priority,
    status: ticketsTable.status,
    customerId: ticketsTable.customerId,
    customerName: customersTable.companyName,
    projectId: ticketsTable.projectId,
    messages: ticketsTable.messages,
    createdAt: ticketsTable.createdAt,
  }).from(ticketsTable)
    .leftJoin(customersTable, eq(ticketsTable.customerId, customersTable.id))
    .orderBy(desc(ticketsTable.createdAt));
  res.json(tickets.map(t => ({ ...t, createdAt: t.createdAt.toISOString() })));
});

router.get("/admin/tickets/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, ticket.customerId));
  res.json({
    ...ticket,
    customerName: customer?.companyName ?? null,
    createdAt: ticket.createdAt.toISOString(),
  });
});

router.patch("/admin/tickets/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status, priority } = req.body;

  const patch: Record<string, string> = {};
  if (status !== undefined) patch["status"] = status;
  if (priority !== undefined) patch["priority"] = priority;
  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: "status or priority is required" });
    return;
  }

  const [record] = await db.update(ticketsTable).set(patch).where(eq(ticketsTable.id, id)).returning();
  if (!record) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json({ ...record, createdAt: record.createdAt.toISOString() });
});

router.post("/admin/tickets/:id/messages", requireStaff, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { body } = req.body;
  if (!body || String(body).trim() === "") {
    res.status(400).json({ error: "body is required" });
    return;
  }

  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }

  // Messages live in a jsonb column, so a reply appends to the array. isStaff
  // is what the portal uses to align and label the message as coming from us.
  const msgs = (ticket.messages as any[]) || [];
  const newMsg = {
    id: msgs.length + 1,
    author: req.session.name,
    body: String(body).trim(),
    isStaff: true,
    createdAt: new Date().toISOString(),
  };
  msgs.push(newMsg);
  await db.update(ticketsTable).set({ messages: msgs }).where(eq(ticketsTable.id, id));
  res.status(201).json(newMsg);
});

router.delete("/admin/tickets/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [record] = await db.delete(ticketsTable).where(eq(ticketsTable.id, id)).returning();
  if (!record) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/admin/invoices", requireStaff, async (_req, res): Promise<void> => {
  const invoices = await db.select({
    id: invoicesTable.id,
    number: invoicesTable.number,
    customerId: invoicesTable.customerId,
    customerName: customersTable.companyName,
    projectId: invoicesTable.projectId,
    amount: invoicesTable.amount,
    currency: invoicesTable.currency,
    status: invoicesTable.status,
    issueDate: invoicesTable.issueDate,
    dueDate: invoicesTable.dueDate,
    createdAt: invoicesTable.createdAt,
  }).from(invoicesTable)
    .leftJoin(customersTable, eq(invoicesTable.customerId, customersTable.id))
    .orderBy(desc(invoicesTable.createdAt));
  res.json(invoices.map(inv => ({ ...inv, amount: parseFloat(String(inv.amount)), createdAt: inv.createdAt.toISOString() })));
});

export default router;
