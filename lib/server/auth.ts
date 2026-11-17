import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "../../db";
import { adminSessions, adminUsers } from "../../db/schema";

export const SESSION_COOKIE = "tm_admin_session";
const SESSION_DAYS = 7;
const DAY_MS = 86_400_000;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Start a session for this admin and set the cookie. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
  await db.insert(adminSessions).values({ id: hashToken(token), userId, expiresAt });
  // Clear out this admin's expired sessions while we're here.
  await db.delete(adminSessions).where(and(eq(adminSessions.userId, userId), lt(adminSessions.expiresAt, new Date())));

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** End the current session (logout). */
export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(adminSessions).where(eq(adminSessions.id, hashToken(token)));
  jar.delete(SESSION_COOKIE);
}

export type AdminSession = { userId: number; username: string };

/**
 * The signed-in admin, or null. Checked against the database on every
 * request (memoised per render), so logging out or a password reset takes
 * effect immediately.
 */
export const getSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ userId: adminUsers.id, username: adminUsers.username })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(and(eq(adminSessions.id, hashToken(token)), gt(adminSessions.expiresAt, new Date())));
  // Sessions last SESSION_DAYS from login; the admin then signs in again.
  return row ?? null;
});

/** For admin pages and actions: the signed-in admin, or a redirect to the login page. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
