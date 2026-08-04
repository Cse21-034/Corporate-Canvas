import { Router, type IRouter } from "express";
import { db, quoteRequestsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/quote-requests", async (req, res): Promise<void> => {
  const { name, company, email, phone, serviceInterest, industry, message, honeypot } = req.body;

  // Spam protection: reject if honeypot field is filled
  if (honeypot) {
    res.status(400).json({ error: "Invalid submission" });
    return;
  }

  if (!name || !company || !email || !phone || !message) {
    res.status(400).json({ error: "name, company, email, phone and message are required" });
    return;
  }

  const [record] = await db.insert(quoteRequestsTable).values({
    name,
    company,
    email,
    phone,
    serviceInterest: Array.isArray(serviceInterest) ? serviceInterest : [],
    industry: industry || null,
    message,
    status: "new",
  }).returning();

  req.log.info({ quoteId: record.id, email }, "New quote request submitted");
  res.status(201).json(record);
});

export default router;
