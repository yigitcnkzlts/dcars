import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const schema = readFileSync(resolve("db/schema.ts"), "utf8");
const migration = readFileSync(resolve("drizzle/0004_secure_operations.sql"), "utf8");
const tables = ["legal_documents","consent_records","notification_events","notification_deliveries","appointment_settings","appointment_closed_days","appointment_bookings","appointment_history","admin_users","admin_sessions","audit_logs","otp_challenges","rate_limit_buckets","vehicle_price_analyses","vehicle_market_comparables"];
for (const table of tables) {
  assert.ok(schema.includes(`\"${table}\"`), `${table} schema içinde eksik`);
  assert.ok(migration.includes(`\`${table}\``), `${table} migration içinde eksik`);
}
for (const column of ["read_at", "cancelled_at", "dedupe_key", "attempt_count", "expires_at"]) assert.ok(migration.includes(`\`${column}\``), `${column} migration içinde eksik`);
assert.match(migration, /appointment_bookings_start_at_unique/);
assert.match(migration, /notification_events_dedupe_key_unique/);
console.log("Schema and migration consistency checks passed.");
