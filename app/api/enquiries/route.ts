import { db } from "../../../db";
import { enquiries } from "../../../db/schema";
import { enquiryInputSchema } from "../../../lib/enquiry-schema";
import { clientKey, rateLimit } from "../../../lib/server/rate-limit";

/**
 * Saves a visitor's request before WhatsApp or their email app opens.
 * Called with fetch(..., { keepalive: true }) so it completes even though
 * the visitor is leaving for WhatsApp.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = enquiryInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  // 15 requests per visitor per 10 minutes is plenty for a real person.
  if (!(await rateLimit(`enquiry:${await clientKey()}`, 15, 10 * 60_000))) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const [row] = await db.insert(enquiries).values(parsed.data).returning({ id: enquiries.id });
  return Response.json({ id: row.id }, { status: 201 });
}
