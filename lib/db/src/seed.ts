/**
 * Seed script — safe to re-run (upserts, never duplicates).
 *
 * Usage:
 *   pnpm --filter @workspace/db run seed
 *
 * Seeds:
 *   - 4 services
 *   - 8 industries
 *   - 1 demo admin staff account  (admin@constructech.co.bw / Admin1234!)
 *   - 1 demo customer             (portal@bmcorp.co.bw    / Demo1234!)
 *   - 1 demo project, ticket, and invoice linked to the demo customer
 */

import { createHash } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set before running the seed.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "ctv_salt_2025").digest("hex");
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SERVICES = [
  {
    slug: "it-infrastructure",
    title: "IT Infrastructure Solutions",
    summary:
      "Building the foundation for your growth. We design robust data centers and scalable cloud environments tailored for the Botswana climate and business needs.",
    body: `A reliable IT infrastructure is the backbone of every modern organisation. Constructatech Ventures designs, supplies, and deploys end-to-end data-centre and cloud environments that scale with your ambitions — from a single-server room to a multi-site hybrid cloud.

Our engineers hold vendor certifications from Dell, HP, and Cisco, and every project follows a structured methodology: discovery, design, build, test, and handover with full documentation. We also provide ongoing management retainers so your infrastructure stays current, patched, and performant.`,
    includes: ["Data Center Design & Build", "Cloud Infrastructure (hybrid & private)", "Server & Storage Solutions", "Virtualisation (VMware / Hyper-V)", "Disaster Recovery & Backup"],
    icon: "server",
    order: 1,
  },
  {
    slug: "networking",
    title: "Networking Services",
    summary:
      "Ensuring high-speed, secure connectivity across your operations. We specialise in LAN/WAN setup and advanced security protocols to protect your data.",
    body: `From a branch-office LAN to a multi-site SD-WAN, Constructatech Ventures delivers networks that are fast, resilient, and secure. We work with Cisco, Ubiquiti, and Fortinet to design layered architectures that meet the performance requirements of Botswana's enterprise and government sectors.

Security is built in from the start — not bolted on afterwards. Every engagement includes a threat-model review, firewall policy design, and a post-implementation penetration test to verify the controls are working.`,
    includes: ["Network Architecture & Design", "LAN / WAN / SD-WAN", "Firewalls & Unified Threat Management", "Wireless (Wi-Fi 6) Deployments", "Network Monitoring & NOC Support"],
    icon: "network",
    order: 2,
  },
  {
    slug: "it-supplies",
    title: "IT Supplies & Hardware",
    summary:
      "A one-stop shop for quality IT equipment. We supply everything from workstations to enterprise storage solutions, ensuring you get the right tools for the job.",
    body: `Constructatech Ventures is an authorised reseller for Dell, HP, Cisco, and Ubiquiti Networks in Botswana. We source genuine hardware with full manufacturer warranties, handle customs clearance and delivery, and provide on-site installation and asset tagging.

Whether you need 10 laptops for a new team or 100 managed switches for a campus rollout, our procurement team will find the best-value configuration for your workload and budget — with no grey-market risk.`,
    includes: ["Servers, Switches & Routers", "Laptops, Desktops & Workstations", "Storage Arrays & NAS", "UPS & Power Protection", "Peripherals & Accessories"],
    icon: "monitor",
    order: 3,
  },
  {
    slug: "automation",
    title: "Automation & Instrumentation",
    summary:
      "Optimising workflows for the modern age. From mining conveyor systems to Building Management Systems (BMS), we automate processes to save time and reduce costs.",
    body: `Botswana's mining, manufacturing, and property sectors are under constant pressure to reduce operating costs and improve safety. Constructatech Ventures brings industrial automation expertise to these challenges — integrating PLCs, SCADA systems, and IoT sensors into a unified operational picture.

Our Building Management System (BMS) practice covers HVAC control, access control, CCTV, and energy metering for commercial and public-sector buildings. Remote monitoring means issues are caught before they become failures.`,
    includes: ["Industrial Automation (PLC / SCADA)", "Building Management Systems (BMS)", "Remote Monitoring & IoT", "CCTV & Physical Security", "Energy Metering & Optimisation"],
    icon: "cpu",
    order: 4,
  },
];

const INDUSTRIES = [
  {
    slug: "mining",
    name: "Mining",
    blurb:
      "Botswana's mining sector demands the highest reliability. We deliver hardened infrastructure and automation systems that keep operations running around the clock in remote and challenging environments.",
    icon: "pickaxe",
    order: 1,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    blurb:
      "From factory-floor automation to enterprise networks, we help manufacturers in Botswana modernise their operations, improve traceability, and reduce unplanned downtime.",
    icon: "factory",
    order: 2,
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    blurb:
      "Clinics and hospitals depend on always-on connectivity. Our healthcare IT solutions prioritise uptime, data security, and compliance, so medical staff can focus on patients, not infrastructure.",
    icon: "heart-pulse",
    order: 3,
  },
  {
    slug: "education",
    name: "Education",
    blurb:
      "We connect schools and universities across Botswana with fast, secure, and cost-effective network infrastructure — supporting e-learning, digital administration, and smart-campus initiatives.",
    icon: "graduation-cap",
    order: 4,
  },
  {
    slug: "retail",
    name: "Retail",
    blurb:
      "Multi-site retailers trust Constructatech Ventures to keep their POS systems, inventory management, and CCTV networks running seamlessly — whether a single store or a national chain.",
    icon: "shopping-cart",
    order: 5,
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    blurb:
      "Banks and financial institutions in Botswana require rigorous security and regulatory compliance. We design network and security architectures that protect sensitive data and meet NBFIRA and BoB guidelines.",
    icon: "landmark",
    order: 6,
  },
  {
    slug: "telecommunications",
    name: "Telecommunications",
    blurb:
      "We partner with telecoms operators to design and deploy the IP backbone and access-layer infrastructure that keeps Botswana connected.",
    icon: "radio-tower",
    order: 7,
  },
  {
    slug: "government",
    name: "Government & Public Sector",
    blurb:
      "From local councils to central government ministries, we provide secure, standards-compliant IT infrastructure and automation solutions that deliver public services reliably and cost-effectively.",
    icon: "building-2",
    order: 8,
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱  Starting seed…\n");

  // --- Services ---
  console.log("  ↳ Services");
  for (const service of SERVICES) {
    await db
      .insert(schema.servicesTable)
      .values(service)
      .onConflictDoUpdate({
        target: schema.servicesTable.slug,
        set: {
          title: service.title,
          summary: service.summary,
          body: service.body,
          includes: service.includes,
          icon: service.icon,
          order: service.order,
        },
      });
  }
  console.log(`     ✔  ${SERVICES.length} services upserted`);

  // --- Industries ---
  console.log("  ↳ Industries");
  for (const industry of INDUSTRIES) {
    await db
      .insert(schema.industriesTable)
      .values(industry)
      .onConflictDoUpdate({
        target: schema.industriesTable.slug,
        set: {
          name: industry.name,
          blurb: industry.blurb,
          icon: industry.icon,
          order: industry.order,
        },
      });
  }
  console.log(`     ✔  ${INDUSTRIES.length} industries upserted`);

  // --- Demo admin staff ---
  console.log("  ↳ Staff");
  await db
    .insert(schema.staffTable)
    .values({
      name: "Admin User",
      email: "admin@constructech.co.bw",
      passwordHash: hashPassword("Admin1234!"),
      role: "admin",
    })
    .onConflictDoUpdate({
      target: schema.staffTable.email,
      set: {
        name: "Admin User",
        role: "admin",
        passwordHash: hashPassword("Admin1234!"),
      },
    });
  console.log("     ✔  1 admin staff upserted  (admin@constructech.co.bw / Admin1234!)");

  // --- Demo customer ---
  console.log("  ↳ Customer");
  const [customer] = await db
    .insert(schema.customersTable)
    .values({
      companyName: "Botswana Mining Corp",
      contactName: "Thabo Mokobi",
      email: "portal@bmcorp.co.bw",
      passwordHash: hashPassword("Demo1234!"),
      phone: "+267 71 234 567",
      status: "active",
    })
    .onConflictDoUpdate({
      target: schema.customersTable.email,
      set: {
        companyName: "Botswana Mining Corp",
        contactName: "Thabo Mokobi",
        phone: "+267 71 234 567",
        status: "active",
      },
    })
    .returning();
  console.log(`     ✔  Customer upserted  (portal@bmcorp.co.bw / Demo1234!, id=${customer.id})`);

  // --- Demo project ---
  console.log("  ↳ Project");
  const existingProjects = await db
    .select()
    .from(schema.projectsTable)
    .where(
      // @ts-ignore – drizzle eq helper
      (await import("drizzle-orm")).eq(schema.projectsTable.customerId, customer.id),
    );

  let projectId: number;
  if (existingProjects.length > 0) {
    projectId = existingProjects[0].id;
    console.log(`     ✔  Project already exists  (id=${projectId})`);
  } else {
    const [project] = await db
      .insert(schema.projectsTable)
      .values({
        title: "Network Infrastructure Upgrade",
        description:
          "Full LAN/WAN redesign and hardware refresh across the Mahalapye head office and two satellite sites. Scope includes Cisco Catalyst switching, Fortinet firewall cluster, and SD-WAN overlay.",
        status: "in-progress",
        customerId: customer.id,
        milestones: [
          { label: "Site survey & discovery", dueDate: "2025-02-15", done: true },
          { label: "Hardware procurement", dueDate: "2025-03-01", done: true },
          { label: "Core switching deployment", dueDate: "2025-03-20", done: true },
          { label: "Firewall & SD-WAN cutover", dueDate: "2025-04-10", done: false },
          { label: "User-acceptance testing", dueDate: "2025-04-25", done: false },
        ],
        startDate: "2025-02-01",
        targetDate: "2025-04-30",
      })
      .returning();
    projectId = project.id;
    console.log(`     ✔  Project created  (id=${projectId})`);
  }

  // --- Demo ticket ---
  console.log("  ↳ Ticket");
  const existingTickets = await db
    .select()
    .from(schema.ticketsTable)
    .where(
      // @ts-ignore
      (await import("drizzle-orm")).eq(schema.ticketsTable.customerId, customer.id),
    );

  if (existingTickets.length > 0) {
    console.log(`     ✔  Ticket already exists  (id=${existingTickets[0].id})`);
  } else {
    const [ticket] = await db
      .insert(schema.ticketsTable)
      .values({
        subject: "Firewall configuration review needed",
        type: "support",
        priority: "high",
        status: "in-progress",
        customerId: customer.id,
        projectId,
        messages: [
          {
            author: "Thabo Mokobi",
            role: "customer",
            body: "Hi team, could you please review the firewall policy? We noticed some outbound traffic being blocked unexpectedly after yesterday's update.",
            timestamp: new Date("2025-03-21T09:15:00Z").toISOString(),
          },
          {
            author: "Admin User",
            role: "staff",
            body: "Thanks Thabo — we have replicated the issue in the lab. It appears one of the application-layer inspection signatures is too aggressive. We will push a policy update within 2 hours. Will keep you posted.",
            timestamp: new Date("2025-03-21T10:02:00Z").toISOString(),
          },
        ],
      })
      .returning();
    console.log(`     ✔  Ticket created  (id=${ticket.id})`);
  }

  // --- Demo invoice ---
  console.log("  ↳ Invoice");
  const existingInvoices = await db
    .select()
    .from(schema.invoicesTable)
    .where(
      // @ts-ignore
      (await import("drizzle-orm")).eq(schema.invoicesTable.number, "INV-2025-001"),
    );

  if (existingInvoices.length > 0) {
    console.log(`     ✔  Invoice already exists  (id=${existingInvoices[0].id})`);
  } else {
    const [invoice] = await db
      .insert(schema.invoicesTable)
      .values({
        number: "INV-2025-001",
        customerId: customer.id,
        projectId,
        amount: "45000.00",
        currency: "BWP",
        status: "sent",
        issueDate: "2025-03-01",
        dueDate: "2025-03-31",
      })
      .returning();
    console.log(`     ✔  Invoice created  (id=${invoice.id})`);
  }

  console.log("\n✅  Seed complete.\n");
  console.log("  Demo logins:");
  console.log("    Staff admin  →  admin@constructech.co.bw  /  Admin1234!");
  console.log("    Portal user  →  portal@bmcorp.co.bw       /  Demo1234!\n");
}

seed()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
