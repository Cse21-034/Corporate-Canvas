import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterSubscribersTable } from "@workspace/db";

const router: IRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const { email, honeypot } = req.body;

  // Spam protection: reject if honeypot field is filled
  if (honeypot) {
    res.status(400).json({ error: "Invalid submission" });
    return;
  }

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "A valid email is required" });
    return;
  }

  try {
    const [record] = await db.insert(newsletterSubscribersTable).values({ email }).returning();
    req.log.info({ email }, "New newsletter subscription");
    res.status(201).json(record);
  } catch (err) {
    // Already subscribed — treat as a success rather than an error, since
    // from the visitor's point of view resubmitting their email should just
    // work, not surface a confusing failure.
    if ((err as { code?: string }).code === "23505") {
      const [existing] = await db
        .select()
        .from(newsletterSubscribersTable)
        .where(eq(newsletterSubscribersTable.email, email));
      res.status(200).json(existing ?? { email });
      return;
    }
    throw err;
  }
});

export default router;
