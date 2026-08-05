/**
 * Default delivery plans applied when a quote is converted into a project.
 *
 * A project that starts with a real plan means the portal progress bar is
 * meaningful from day one, instead of sitting at 0% until someone hand-builds
 * a list. Staff edit, add, remove and tick these off afterwards — the template
 * is a starting point, not a constraint.
 *
 * Offsets are days from the project start date, so the dates land relative to
 * when the work actually begins.
 */

export interface MilestoneTemplateStep {
  label: string;
  offsetDays: number;
}

const TEMPLATES: Record<string, MilestoneTemplateStep[]> = {
  "it-infrastructure": [
    { label: "Site survey & discovery", offsetDays: 14 },
    { label: "Design sign-off", offsetDays: 28 },
    { label: "Hardware procurement", offsetDays: 45 },
    { label: "Installation & configuration", offsetDays: 70 },
    { label: "Testing & handover", offsetDays: 90 },
  ],
  networking: [
    { label: "Network assessment", offsetDays: 10 },
    { label: "Architecture design sign-off", offsetDays: 21 },
    { label: "Equipment procurement", offsetDays: 35 },
    { label: "Deployment & cutover", offsetDays: 56 },
    { label: "Security review & handover", offsetDays: 70 },
  ],
  "it-supplies": [
    { label: "Requirements confirmed", offsetDays: 5 },
    { label: "Quotation accepted", offsetDays: 10 },
    { label: "Order placed with supplier", offsetDays: 14 },
    { label: "Delivery & asset tagging", offsetDays: 30 },
    { label: "Sign-off", offsetDays: 35 },
  ],
  automation: [
    { label: "Process assessment", offsetDays: 14 },
    { label: "Instrumentation design sign-off", offsetDays: 30 },
    { label: "Equipment procurement", offsetDays: 50 },
    { label: "Installation & calibration", offsetDays: 75 },
    { label: "Commissioning & handover", offsetDays: 95 },
  ],
};

const GENERIC: MilestoneTemplateStep[] = [
  { label: "Discovery & requirements", offsetDays: 14 },
  { label: "Proposal sign-off", offsetDays: 28 },
  { label: "Delivery", offsetDays: 60 },
  { label: "Testing & handover", offsetDays: 75 },
];

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Pick a template from whatever the public quote form recorded. Those values
 * are free-ish text, so match on the slug first and fall back to a loose
 * substring match before giving up and using the generic plan.
 */
export function buildMilestones(
  serviceInterest: string[],
  startDate: string,
): Array<{ label: string; dueDate: string; done: boolean }> {
  let steps: MilestoneTemplateStep[] | undefined;

  for (const raw of serviceInterest ?? []) {
    const needle = String(raw).trim().toLowerCase().replace(/\s+/g, "-");
    if (TEMPLATES[needle]) {
      steps = TEMPLATES[needle];
      break;
    }
    const loose = Object.keys(TEMPLATES).find(
      (slug) => needle.includes(slug) || slug.includes(needle),
    );
    if (loose) {
      steps = TEMPLATES[loose];
      break;
    }
  }

  return (steps ?? GENERIC).map((step) => ({
    label: step.label,
    dueDate: addDays(startDate, step.offsetDays),
    done: false,
  }));
}
