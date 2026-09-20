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
