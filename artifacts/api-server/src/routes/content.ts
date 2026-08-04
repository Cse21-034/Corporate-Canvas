import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db, servicesTable, industriesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/services", async (_req, res): Promise<void> => {
  const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.order));
  res.json(services);
});

router.get("/services/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.slug, slug));
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(service);
});

router.get("/industries", async (_req, res): Promise<void> => {
  const industries = await db.select().from(industriesTable).orderBy(asc(industriesTable.order));
  res.json(industries);
});

router.get("/stats", async (_req, res): Promise<void> => {
  res.json({
    projectsCompleted: 48,
    clientsServed: 32,
    yearsActive: 6,
    industriesServed: 8,
  });
});

export default router;
