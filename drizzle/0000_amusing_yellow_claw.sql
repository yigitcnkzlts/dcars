CREATE TABLE `ai_vehicle_conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle` text NOT NULL,
	`messages` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `valuation_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` integer,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`details` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle_brands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo_url` text,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_brands_slug_unique` ON `vehicle_brands` (`slug`);--> statement-breakpoint
CREATE TABLE `vehicle_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_id` integer NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `vehicle_brands`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicle_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`year` integer,
	`fuel_type` text,
	`transmission` text,
	`engine` text,
	`trim` text,
	FOREIGN KEY (`model_id`) REFERENCES `vehicle_models`(`id`) ON UPDATE no action ON DELETE no action
);
