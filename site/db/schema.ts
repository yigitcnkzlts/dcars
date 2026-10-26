import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vehicleBrands = sqliteTable("vehicle_brands", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	logoUrl: text("logo_url"),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const vehicleModels = sqliteTable("vehicle_models", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	brandId: integer("brand_id").notNull().references(() => vehicleBrands.id),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const vehicleGenerations = sqliteTable("vehicle_generations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	modelId: integer("model_id").notNull().references(() => vehicleModels.id),
	name: text("name").notNull(),
	code: text("code"),
	bodyType: text("body_type"),
	startYear: integer("start_year").notNull(),
	endYear: integer("end_year"),
	sourceUrl: text("source_url").notNull(),
});

export const vehicleEngines = sqliteTable("vehicle_engines", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	generationId: integer("generation_id").notNull().references(() => vehicleGenerations.id),
	name: text("name").notNull(),
	engineCc: integer("engine_cc"),
	powerHp: integer("power_hp"),
	powerKw: integer("power_kw"),
	fuelType: text("fuel_type").notNull(),
	transmission: text("transmission").notNull(),
	transmissionType: text("transmission_type"),
	driveType: text("drive_type"),
	startYear: integer("start_year").notNull(),
	endYear: integer("end_year"),
	sourceUrl: text("source_url").notNull(),
});

export const vehicleTrims = sqliteTable("vehicle_trims", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	generationId: integer("generation_id").notNull().references(() => vehicleGenerations.id),
	name: text("name").notNull(),
	startYear: integer("start_year").notNull(),
	endYear: integer("end_year"),
	sourceUrl: text("source_url").notNull(),
});

export const vehicleVariants = sqliteTable("vehicle_variants", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	modelId: integer("model_id").notNull().references(() => vehicleModels.id),
	year: integer("year"),
	fuelType: text("fuel_type"),
	transmission: text("transmission"),
	engine: text("engine"),
	trim: text("trim"),
	generationId: integer("generation_id").references(() => vehicleGenerations.id),
	engineId: integer("engine_id").references(() => vehicleEngines.id),
	trimId: integer("trim_id").references(() => vehicleTrims.id),
	market: text("market").notNull().default("TR"),
	sourceUrl: text("source_url"),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const valuationRequests = sqliteTable("valuation_requests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	year: integer("year"),
	brand: text("brand").notNull(),
	model: text("model").notNull(),
	details: text("details", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	phone: text("phone").notNull(),
	email: text("email").notNull(),
	status: text("status").notNull().default("received"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const legalDocuments = sqliteTable("legal_documents", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	version: text("version").notNull(),
	content: text("content").notNull(),
	published: integer("published", { mode: "boolean" }).notNull().default(false),
	validFrom: text("valid_from"),
	updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const consentRecords = sqliteTable("consent_records", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	requestId: integer("request_id").references(() => valuationRequests.id),
	subjectRef: text("subject_ref").notNull(),
	purpose: text("purpose").notNull(),
	granted: integer("granted", { mode: "boolean" }).notNull(),
	documentSlug: text("document_slug").notNull(),
	documentVersion: text("document_version").notNull(),
	source: text("source").notNull(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
	revokedAt: text("revoked_at"),
});

export const notificationEvents = sqliteTable("notification_events", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	type: text("type").notNull(),
	referenceType: text("reference_type").notNull(),
	referenceId: text("reference_id").notNull(),
	payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	dedupeKey: text("dedupe_key").notNull().unique(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const notificationDeliveries = sqliteTable("notification_deliveries", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	eventId: integer("event_id").notNull().references(() => notificationEvents.id),
	channel: text("channel").notNull(),
	destination: text("destination"),
	status: text("status").notNull().default("pending"),
	attemptCount: integer("attempt_count").notNull().default(0),
	nextAttemptAt: text("next_attempt_at"),
	providerMessageId: text("provider_message_id"),
	lastError: text("last_error"),
	readAt: text("read_at"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
	updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const appointmentSettings = sqliteTable("appointment_settings", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	weekday: integer("weekday").notNull(),
	startTime: text("start_time").notNull(),
	endTime: text("end_time").notNull(),
	slotMinutes: integer("slot_minutes").notNull().default(60),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const appointmentClosedDays = sqliteTable("appointment_closed_days", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	date: text("date").notNull().unique(),
	reason: text("reason"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const appointmentBookings = sqliteTable("appointment_bookings", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	requestId: integer("request_id").notNull().references(() => valuationRequests.id),
	startAt: text("start_at").notNull().unique(),
	endAt: text("end_at").notNull(),
	timezone: text("timezone").notNull().default("Europe/Istanbul"),
	status: text("status").notNull().default("requested"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
	updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
	cancelledAt: text("cancelled_at"),
});

export const appointmentHistory = sqliteTable("appointment_history", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	bookingId: integer("booking_id").notNull().references(() => appointmentBookings.id),
	fromStatus: text("from_status"),
	toStatus: text("to_status").notNull(),
	actorType: text("actor_type").notNull(),
	note: text("note"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const adminUsers = sqliteTable("admin_users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	role: text("role").notNull().default("staff"),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
	lastLoginAt: text("last_login_at"),
});

export const adminSessions = sqliteTable("admin_sessions", {
	id: text("id").primaryKey(),
	adminUserId: integer("admin_user_id").references(() => adminUsers.id),
	role: text("role").notNull(),
	expiresAt: text("expires_at").notNull(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const auditLogs = sqliteTable("audit_logs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	actorId: text("actor_id").notNull(),
	actorRole: text("actor_role").notNull(),
	action: text("action").notNull(),
	targetType: text("target_type").notNull(),
	targetId: text("target_id"),
	metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const otpChallenges = sqliteTable("otp_challenges", {
	id: text("id").primaryKey(),
	phoneHash: text("phone_hash").notNull(),
	codeHash: text("code_hash").notNull(),
	purpose: text("purpose").notNull(),
	expiresAt: text("expires_at").notNull(),
	attemptCount: integer("attempt_count").notNull().default(0),
	consumedAt: text("consumed_at"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const rateLimitBuckets = sqliteTable("rate_limit_buckets", {
	key: text("key").primaryKey(),
	windowStart: integer("window_start").notNull(),
	count: integer("count").notNull().default(0),
});

export const vehiclePriceAnalyses = sqliteTable("vehicle_price_analyses", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	requestId: integer("request_id").references(() => valuationRequests.id),
	input: text("input", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	result: text("result", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	dataSource: text("data_source").notNull(),
	confidence: text("confidence").notNull(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const vehicleMarketComparables = sqliteTable("vehicle_market_comparables", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	brand: text("brand").notNull(),
	model: text("model").notNull(),
	year: integer("year").notNull(),
	mileage: integer("mileage").notNull(),
	price: integer("price").notNull(),
	fuelType: text("fuel_type"),
	transmission: text("transmission"),
	trim: text("trim"),
	sourceName: text("source_name").notNull(),
	sourceRecordId: text("source_record_id").notNull().unique(),
	observedAt: text("observed_at").notNull(),
	licensed: integer("licensed", { mode: "boolean" }).notNull().default(false),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const valuationDrafts = sqliteTable("valuation_drafts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	firstName: text("first_name").notNull(),
	phone: text("phone").notNull(),
	vehicle: text("vehicle", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	status: text("status").notNull().default("draft"),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const valuationPhotos = sqliteTable("valuation_photos", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	requestId: integer("request_id").notNull().references(() => valuationRequests.id),
	objectKey: text("object_key").notNull().unique(),
	area: text("area").notNull(),
	fileName: text("file_name").notNull(),
	contentType: text("content_type").notNull(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const aiVehicleConversations = sqliteTable("ai_vehicle_conversations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	vehicle: text("vehicle", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
	messages: text("messages", { mode: "json" }).$type<unknown[]>().notNull(),
	createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});
