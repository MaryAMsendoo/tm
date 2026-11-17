/**
 * Admin accounts, for developers (there is no email-based reset by design).
 *
 *   npm run admin:create -- <username>
 *   npm run admin:reset-password -- <username>
 *
 * Asks for the new password twice (input hidden). For automation you can set
 * ADMIN_PASSWORD in the environment instead. Resetting a password signs the
 * admin out everywhere.
 */
import { createInterface } from "node:readline";
import { eq } from "drizzle-orm";
import { db, pool } from "../db";
import { adminSessions, adminUsers } from "../db/schema";
import { MIN_PASSWORD_LENGTH, hashPassword } from "../lib/password";

function ask(question: string, hidden: boolean): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Print the prompt, then swallow the typed characters.
      const write = (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput;
      (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s: string) => {
        if (s.startsWith(question)) write.call(rl, question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function newPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD;
  const password = fromEnv ?? (await ask("New password: ", true));
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (!fromEnv && (await ask("Repeat the password: ", true)) !== password) {
    throw new Error("The passwords do not match.");
  }
  return hashPassword(password);
}

async function main() {
  const [command, rawUsername] = process.argv.slice(2);
  const username = rawUsername?.trim().toLowerCase();
  if (!["create", "reset-password"].includes(command) || !username) {
    console.error("Usage: npm run admin:create -- <username>");
    console.error("       npm run admin:reset-password -- <username>");
    process.exitCode = 1;
    return;
  }
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) {
    throw new Error("Usernames are 3-40 characters: letters, numbers, dots, dashes or underscores.");
  }

  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));

  if (command === "create") {
    if (existing) throw new Error(`An admin called "${username}" already exists. Use admin:reset-password.`);
    await db.insert(adminUsers).values({ username, passwordHash: await newPassword() });
    console.log(`Admin "${username}" created. Sign in at /admin/login.`);
  } else {
    if (!existing) throw new Error(`No admin called "${username}".`);
    await db.update(adminUsers).set({ passwordHash: await newPassword() }).where(eq(adminUsers.id, existing.id));
    const ended = await db.delete(adminSessions).where(eq(adminSessions.userId, existing.id)).returning();
    console.log(`Password for "${username}" changed. Signed out of ${ended.length} session(s).`);
  }
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
