import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, quoteRequestsTable, customersTable, projectsTable, ticketsTable, invoicesTable, servicesTable } from "@workspace/db";
import { getSession } from "../lib/session";
import { hashPassword } from "../lib/auth";
import { buildMilestones } from "../lib/milestone-templates";

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

router.post("/admin/quote-requests/:id/convert", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [quote] = await db.select().from(quoteRequestsTable).where(eq(quoteRequestsTable.id, id));
  if (!quote) {
    res.status(404).json({ error: "Quote request not found" });
    return;
  }

  // Already converted: hand back what exists rather than creating a second
  // customer and project on a double click.
  if (quote.projectId) {
    res.status(200).json({
      customerId: quote.customerId,
      projectId: quote.projectId,
      createdCustomer: false,
      alreadyConverted: true,
      password: null,
    });
    return;
  }

  const email = quote.email.trim().toLowerCase();
  const [existing] = await db.select().from(customersTable).where(eq(customersTable.email, email));

  let customerId: number;
  let createdCustomer = false;
  let password: string | null = null;

  if (existing) {
    customerId = existing.id;
  } else {
    // Readable generated password — ambiguous characters left out so it can be
    // dictated over the phone without confusion.
    const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    password = Array.from({ length: 12 }, () =>
      alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join("");

    const [created] = await db
      .insert(customersTable)
      .values({
        companyName: quote.company.trim(),
        contactName: quote.name.trim(),
        email,
        phone: quote.phone.trim(),
        passwordHash: await hashPassword(password),
        status: "active",
      })
      .returning();
    customerId = created.id;
    createdCustomer = true;
  }

  const startDate = new Date().toISOString().slice(0, 10);
  const services = (quote.serviceInterest ?? []).filter(Boolean);
  const title = services.length
    ? `${services.join(", ")} — ${quote.company.trim()}`
    : `New engagement — ${quote.company.trim()}`;

  const descriptionParts = [quote.message?.trim()].filter(Boolean) as string[];
  if (quote.industry) descriptionParts.push(`Industry: ${quote.industry}`);
  if (services.length) descriptionParts.push(`Services requested: ${services.join(", ")}`);

  const milestones = buildMilestones(services, startDate);

  const [project] = await db
    .insert(projectsTable)
    .values({
      title,
      description: descriptionParts.join("\n\n") || "Converted from a quote request.",
      status: "scoping",
      customerId,
      milestones,
      startDate,
      targetDate: milestones.length ? milestones[milestones.length - 1].dueDate : null,
    })
    .returning();

  await db
    .update(quoteRequestsTable)
    .set({ status: "won", customerId, projectId: project.id })
    .where(eq(quoteRequestsTable.id, id));

  res.status(201).json({
    customerId,
    projectId: project.id,
    createdCustomer,
    alreadyConverted: false,
    // Shown once. With no mail server this is the only chance to capture it.
    password,
  });
});

router.get("/admin/customers/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  const { passwordHash: _omit, ...safe } = customer;
  res.json({ ...safe, createdAt: customer.createdAt.toISOString() });
});

router.patch("/admin/customers/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { companyName, contactName, email, phone, status, password } = req.body;

  const patch: Record<string, string> = {};
  if (companyName !== undefined) patch["companyName"] = String(companyName).trim();
  if (contactName !== undefined) patch["contactName"] = String(contactName).trim();
  if (phone !== undefined) patch["phone"] = String(phone).trim();
  if (status !== undefined) patch["status"] = status;

  if (email !== undefined) {
    const normalised = String(email).trim().toLowerCase();
    const [clash] = await db.select().from(customersTable).where(eq(customersTable.email, normalised));
    if (clash && clash.id !== id) {
      res.status(409).json({ error: "Another customer already uses that email" });
      return;
    }
    patch["email"] = normalised;
  }

  if (password !== undefined && String(password) !== "") {
    if (String(password).length < 8) {
      res.status(400).json({ error: "password must be at least 8 characters" });
      return;
    }
    patch["passwordHash"] = await hashPassword(String(password));
  }

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [record] = await db.update(customersTable).set(patch).where(eq(customersTable.id, id)).returning();
  if (!record) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  const { passwordHash: _omit, ...safe } = record;
  res.json({ ...safe, createdAt: record.createdAt.toISOString() });
});

router.delete("/admin/customers/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }

  // customerId on these tables is a bare integer with no foreign key, so
  // Postgres would let the delete through and leave the rows pointing at a
  // customer that no longer exists. Refuse instead, and say what is in the
  // way — deactivating keeps the history intact.
  const [projects, tickets, invoices] = await Promise.all([
    db.select().from(projectsTable).where(eq(projectsTable.customerId, id)),
    db.select().from(ticketsTable).where(eq(ticketsTable.customerId, id)),
    db.select().from(invoicesTable).where(eq(invoicesTable.customerId, id)),
  ]);

  if (projects.length || tickets.length || invoices.length) {
    const parts = [
      projects.length ? `${projects.length} project${projects.length === 1 ? "" : "s"}` : null,
      tickets.length ? `${tickets.length} ticket${tickets.length === 1 ? "" : "s"}` : null,
      invoices.length ? `${invoices.length} invoice${invoices.length === 1 ? "" : "s"}` : null,
    ].filter(Boolean);
    res.status(409).json({
      error: `This customer still has ${parts.join(", ")}. Delete those first, or set the customer to inactive instead.`,
    });
    return;
  }

  await db.delete(customersTable).where(eq(customersTable.id, id));
  res.sendStatus(204);
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
    messages: projectsTable.messages,
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

router.post("/admin/projects/:id/messages", requireStaff, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { body } = req.body;
  if (!body || String(body).trim() === "") {
    res.status(400).json({ error: "body is required" });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const msgs = (project.messages as any[]) || [];
  const newMsg = {
    id: msgs.length + 1,
    author: req.session.name,
    body: String(body).trim(),
    isStaff: true,
    createdAt: new Date().toISOString(),
  };
  msgs.push(newMsg);
  await db.update(projectsTable).set({ messages: msgs }).where(eq(projectsTable.id, id));
  res.status(201).json(newMsg);
});

router.delete("/admin/projects/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  // Same absent-foreign-key problem as customers: tickets and invoices carry a
  // projectId that nothing enforces. Rather than orphan them, detach them —
  // they still belong to the customer, just no longer to a project.
  const [tickets, invoices] = await Promise.all([
    db.select().from(ticketsTable).where(eq(ticketsTable.projectId, id)),
    db.select().from(invoicesTable).where(eq(invoicesTable.projectId, id)),
  ]);

  if (tickets.length) {
    await db.update(ticketsTable).set({ projectId: null }).where(eq(ticketsTable.projectId, id));
  }
  if (invoices.length) {
    await db.update(invoicesTable).set({ projectId: null }).where(eq(invoicesTable.projectId, id));
  }

  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(200).json({
    detachedTickets: tickets.length,
    detachedInvoices: invoices.length,
  });
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

router.post("/admin/invoices", requireStaff, async (req, res): Promise<void> => {
  const { number, customerId, projectId, amount, currency, status, issueDate, dueDate } = req.body;

  if (!number || !customerId || amount === undefined || !issueDate || !dueDate) {
    res.status(400).json({ error: "number, customerId, amount, issueDate and dueDate are required" });
    return;
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
    res.status(400).json({ error: "amount must be a non-negative number" });
    return;
  }

  const [existing] = await db.select().from(invoicesTable).where(eq(invoicesTable.number, String(number).trim()));
  if (existing) {
    res.status(409).json({ error: "An invoice with that number already exists" });
    return;
  }

  const [record] = await db
    .insert(invoicesTable)
    .values({
      number: String(number).trim(),
      customerId: Number(customerId),
      projectId: projectId ? Number(projectId) : null,
      // numeric columns round-trip as strings in pg
      amount: String(parsedAmount),
      currency: currency ?? "BWP",
      status: status ?? "draft",
      issueDate,
      dueDate,
    })
    .returning();

  res.status(201).json({
    ...record,
    amount: parseFloat(String(record.amount)),
    customerName: null,
    createdAt: record.createdAt.toISOString(),
  });
});

router.patch("/admin/invoices/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status, amount, dueDate } = req.body;

  const patch: Record<string, string> = {};
  if (status !== undefined) patch["status"] = status;
  if (dueDate !== undefined) patch["dueDate"] = dueDate;
  if (amount !== undefined) {
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      res.status(400).json({ error: "amount must be a non-negative number" });
      return;
    }
    patch["amount"] = String(parsedAmount);
  }
  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: "status, amount or dueDate is required" });
    return;
  }

  const [record] = await db.update(invoicesTable).set(patch).where(eq(invoicesTable.id, id)).returning();
  if (!record) {
    res.status(404).json({ error: "Invoice not found" });
    return;
  }
  res.json({
    ...record,
    amount: parseFloat(String(record.amount)),
    customerName: null,
    createdAt: record.createdAt.toISOString(),
  });
});

router.delete("/admin/invoices/:id", requireStaff, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
  if (!invoice) {
    res.status(404).json({ error: "Invoice not found" });
    return;
  }

  // A paid invoice is an accounting record, not a draft — refuse to erase it
  // and let staff mark it cancelled instead.
  if (invoice.status === "paid") {
    res.status(409).json({ error: "A paid invoice cannot be deleted" });
    return;
  }

  await db.delete(invoicesTable).where(eq(invoicesTable.id, id));
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
