"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { DUMMY_HASH, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/server/auth";
import { clearRateLimit, clientKey, rateLimit } from "@/lib/server/rate-limit";

export type LoginState = { error?: string; username?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password.", username };

  const limitKey = `login:${await clientKey()}`;
  if (!(await rateLimit(limitKey, 10, 15 * 60_000))) {
    return { error: "Too many attempts. Please wait 15 minutes and try again.", username };
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  // Always run the hash check so the response time doesn't reveal whether the username exists.
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "Wrong username or password.", username };

  await clearRateLimit(limitKey);
  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
