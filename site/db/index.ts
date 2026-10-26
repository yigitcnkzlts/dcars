import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("Cloudflare D1 binding `DB` is unavailable in this runtime.");
    this.name = "DatabaseUnavailableError";
  }
}

export function getDb() {
  if (!env.DB) {
    throw new DatabaseUnavailableError();
  }

  return drizzle(env.DB, { schema });
}
