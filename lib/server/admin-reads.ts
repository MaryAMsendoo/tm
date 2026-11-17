import "server-only";

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { settings } from "../../db/schema";
import { settingsSchemas, type SettingsKey, type SettingsValue } from "../content-schemas";

/** Uncached read for the admin forms (the public site uses the cached getSettings). */
export async function getSettingsFresh<K extends SettingsKey>(key: K): Promise<SettingsValue<K>> {
  const [row] = await db.select().from(settings).where(eq(settings.key, key));
  if (!row) throw new Error(`Missing site settings "${key}". Run npm run db:seed.`);
  return settingsSchemas[key].parse(row.value) as SettingsValue<K>;
}
