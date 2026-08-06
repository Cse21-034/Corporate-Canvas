import { Router, type IRouter } from "express";
import { eq, and, desc, count } from "drizzle-orm";
import { db, projectsTable, ticketsTable, invoicesTable, customersTable } from "@workspace/db";
import { getSession } from "../lib/session";

const router: IRouter = Router();

// Auth middleware for portal
function requireCustomer(req: any, res: any, next: any): void {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  req.session = session;
  next();
}

router.get("/portal/dashboard", requireCustomer, async (req: any, res): Promise<void> => {
  const customerId = req.session.userId;

  const [projectRows, ticketRows, invoiceRows] = await Promise.all([
    db.select().from(projectsTable).where(eq(projectsTable.customerId, customerId)),
    db.select().from(ticketsTable).where(eq(ticketsTable.customerId, customerId)),
    db.select().from(invoicesTable).where(eq(invoicesTable.customerId, customerId)),
  ]);

  const activeProjects = projectRows.filter(p => p.status !== "completed").length;
  const openTickets = ticketRows.filter(t => t.status === "open" || t.status === "in-progress").length;
  const unpaidInvoicesList = invoiceRows.filter(i => i.status === "sent" || i.status === "overdue");
  const unpaidInvoices = unpaidInvoicesList.length;
  const totalInvoiceAmount = unpaidInvoicesList.reduce((sum, inv) => sum + parseFloat(String(inv.amount)), 0);

  // Build recent activity
  const activity: any[] = [];
  let actId = 1;
  for (const p of projectRows.slice(-3)) {
    activity.push({ id: actId++, type: "project", description: `Project "${p.title}" — status: ${p.status}`, createdAt: p.createdAt.toISOString() });
  }
  for (const t of ticketRows.slice(-3)) {
    activity.push({ id: actId++, type: "ticket", description: `Ticket "${t.subject}" — ${t.status}`, createdAt: t.createdAt.toISOString() });
  }
  activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    activeProjects,
    openTickets,
    unpaidInvoices,
    totalInvoiceAmount,
    recentActivity: activity.slice(0, 5),
  });
});

router.get("/portal/projects", requireCustomer, async (req: any, res): Promise<void> => {
  const projects = await db.select().from(projectsTable)
    .where(eq(projectsTable.customerId, req.session.userId))
    .orderBy(desc(projectsTable.createdAt));
  res.json(projects.map(p => ({ ...p, customerName: null, createdAt: p.createdAt.toISOString() })));
});

router.get("/portal/projects/:id", requireCustomer, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.customerId, req.session.userId)));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ ...project, customerName: null, createdAt: project.createdAt.toISOString() });
});

router.post("/portal/projects/:id/messages", requireCustomer, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { body } = req.body;
  if (!body || String(body).trim() === "") {
    res.status(400).json({ error: "body is required" });
    return;
  }
  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.customerId, req.session.userId)));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const msgs = (project.messages as any[]) || [];
  const newMsg = { id: msgs.length + 1, author: req.session.name, body: String(body).trim(), isStaff: false, createdAt: new Date().toISOString() };
  msgs.push(newMsg);
  await db.update(projectsTable).set({ messages: msgs }).where(eq(projectsTable.id, id));
  res.status(201).json(newMsg);
});

router.get("/portal/tickets", requireCustomer, async (req: any, res): Promise<void> => {
  const { status } = req.query;
  let query = db.select().from(ticketsTable).where(eq(ticketsTable.customerId, req.session.userId));
  const tickets = await db.select().from(ticketsTable)
    .where(eq(ticketsTable.customerId, req.session.userId))
    .orderBy(desc(ticketsTable.createdAt));
  const filtered = status ? tickets.filter(t => t.status === status) : tickets;
  res.json(filtered.map(t => ({ ...t, customerName: null, createdAt: t.createdAt.toISOString() })));
});

router.post("/portal/tickets", requireCustomer, async (req: any, res): Promise<void> => {
  const { subject, type, priority, projectId, body } = req.body;
  if (!subject || !type || !priority || !body) {
    res.status(400).json({ error: "subject, type, priority, and body are required" });
    return;
  }
  const messages = [{ id: 1, author: req.session.name, body, isStaff: false, createdAt: new Date().toISOString() }];
  const [ticket] = await db.insert(ticketsTable).values({
    subject,
    type,
    priority,
    status: "open",
    customerId: req.session.userId,
    projectId: projectId || null,
    messages,
  }).returning();
  res.status(201).json({ ...ticket, customerName: null, createdAt: ticket.createdAt.toISOString() });
});

router.get("/portal/tickets/:id", requireCustomer, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [ticket] = await db.select().from(ticketsTable)
    .where(and(eq(ticketsTable.id, id), eq(ticketsTable.customerId, req.session.userId)));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json({ ...ticket, customerName: null, createdAt: ticket.createdAt.toISOString() });
});

router.post("/portal/tickets/:id/messages", requireCustomer, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { body } = req.body;
  if (!body) {
    res.status(400).json({ error: "body is required" });
    return;
  }
  const [ticket] = await db.select().from(ticketsTable)
    .where(and(eq(ticketsTable.id, id), eq(ticketsTable.customerId, req.session.userId)));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const msgs = (ticket.messages as any[]) || [];
  const newMsg = { id: msgs.length + 1, author: req.session.name, body, isStaff: false, createdAt: new Date().toISOString() };
  msgs.push(newMsg);
  await db.update(ticketsTable).set({ messages: msgs }).where(eq(ticketsTable.id, id));
  res.status(201).json(newMsg);
});

router.get("/portal/invoices", requireCustomer, async (req: any, res): Promise<void> => {
  const invoices = await db.select().from(invoicesTable)
    .where(eq(invoicesTable.customerId, req.session.userId))
    .orderBy(desc(invoicesTable.createdAt));
  res.json(invoices.map(inv => ({ ...inv, amount: parseFloat(String(inv.amount)), customerName: null, createdAt: inv.createdAt.toISOString() })));
});

router.get("/portal/account", requireCustomer, async (req: any, res): Promise<void> => {
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, req.session.userId));
  if (!customer) {
    res.status(401).json({ error: "Session invalid" });
    return;
  }
  res.json({ id: customer.id, companyName: customer.companyName, contactName: customer.contactName, email: customer.email, phone: customer.phone });
});

router.patch("/portal/account", requireCustomer, async (req: any, res): Promise<void> => {
  const { contactName, phone, companyName } = req.body;
  const updates: any = {};
  if (contactName) updates.contactName = contactName;
  if (phone) updates.phone = phone;
  if (companyName) updates.companyName = companyName;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No valid fields to update" });
    return;
  }
  const [customer] = await db.update(customersTable).set(updates).where(eq(customersTable.id, req.session.userId)).returning();
  res.json({ id: customer.id, companyName: customer.companyName, contactName: customer.contactName, email: customer.email, phone: customer.phone });
});

export default router;
