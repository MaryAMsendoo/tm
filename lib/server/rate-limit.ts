import "server-only";

import { createHash } from "node:crypto";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "../../db";
import { rateLimitEvents } from "../../db/schema";

/**
 * Sliding-window limiter stored in Postgres, so it works across serverless
 * instances. Returns true when the action is allowed (and records it).
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  const [{ n }] = await db
    .select({ n: count() })
    .from(rateLimitEvents)
    .where(and(eq(rateLimitEvents.key, key), gt(rateLimitEvents.createdAt, since)));
  if (n >= limit) return false;

  await db.insert(rateLimitEvents).values({ key });

  // Occasionally clear out old events so the table stays small.
  if (Math.random() < 0.02) {
    await db.delete(rateLimitEvents).where(lt(rateLimitEvents.createdAt, new Date(Date.now() - 86_400_000)));
  }
  return true;
}

/** Forget recorded events for a key (e.g. after a successful login). */
export async function clearRateLimit(key: string) {
  await db.delete(rateLimitEvents).where(eq(rateLimitEvents.key, key));
}

/** Hashed client IP: enough to tell visitors apart without storing the address. */
export async function clientKey() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
