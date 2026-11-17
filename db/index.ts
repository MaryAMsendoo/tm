/**
 * Database connection. Used by the Next.js server and by the scripts in
 * scripts/ (which is why this file does not import "server-only").
 * Never import it from a client component.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }
  // Neon gives sslmode=require. node-postgres already treats that as full
  // certificate verification; saying so explicitly silences its warning.
  return url.replace(/sslmode=require\b/, "sslmode=verify-full");
}

// Reuse one pool across hot reloads in development.
const globalForDb = globalThis as unknown as { tmPool?: Pool };

const pool =
  globalForDb.tmPool ??
  new Pool({
    connectionString: connectionString(),
    // Serverless-friendly: few connections per instance; Neon's pooler does the rest.
    max: 5,
    idleTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") globalForDb.tmPool = pool;

export const db = drizzle(pool, { schema, casing: "snake_case" });
export { pool, schema };
