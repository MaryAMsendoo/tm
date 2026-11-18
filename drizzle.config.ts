import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env.local on its own. `npm run db:migrate:live`
// passes the live database instead (.env.live), which must win.
try {
  if (!process.env.DATABASE_URL) process.loadEnvFile(".env.local");
} catch {
  // Fine in CI or hosting, where the variables come from the environment.
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  // sslmode=verify-full is what node-postgres already does for "require"; saying so silences its warning.
  dbCredentials: { url: process.env.DATABASE_URL!.replace(/sslmode=require\b/, "sslmode=verify-full") },
  strict: true,
  verbose: true,
});
