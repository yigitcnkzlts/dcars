CREATE TABLE `vehicle_engines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`generation_id` integer NOT NULL,
	`name` text NOT NULL,
	`engine_cc` integer,
	`power_hp` integer,
	`power_kw` integer,
	`fuel_type` text NOT NULL,
	`transmission` text NOT NULL,
	`transmission_type` text,
	`drive_type` text,
	`start_year` integer NOT NULL,
	`end_year` integer,
	`source_url` text NOT NULL,
	FOREIGN KEY (`generation_id`) REFERENCES `vehicle_generations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicle_generations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`name` text NOT NULL,
	`code` text,
	`body_type` text,
	`start_year` integer NOT NULL,
	`end_year` integer,
	`source_url` text NOT NULL,
	FOREIGN KEY (`model_id`) REFERENCES `vehicle_models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicle_trims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`generation_id` integer NOT NULL,
	`name` text NOT NULL,
	`start_year` integer NOT NULL,
	`end_year` integer,
	`source_url` text NOT NULL,
	FOREIGN KEY (`generation_id`) REFERENCES `vehicle_generations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `vehicle_variants` ADD `generation_id` integer REFERENCES vehicle_generations(id);--> statement-breakpoint
ALTER TABLE `vehicle_variants` ADD `engine_id` integer REFERENCES vehicle_engines(id);--> statement-breakpoint
ALTER TABLE `vehicle_variants` ADD `trim_id` integer REFERENCES vehicle_trims(id);--> statement-breakpoint
ALTER TABLE `vehicle_variants` ADD `market` text DEFAULT 'TR' NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicle_variants` ADD `source_url` text;--> statement-breakpoint
ALTER TABLE `vehicle_variants` ADD `active` integer DEFAULT true NOT NULL;
--> statement-breakpoint
CREATE TRIGGER vehicle_variant_year_insert BEFORE INSERT ON vehicle_variants
WHEN NEW.generation_id IS NOT NULL OR NEW.engine_id IS NOT NULL OR NEW.trim_id IS NOT NULL
BEGIN
  SELECT CASE WHEN NEW.generation_id IS NULL OR NEW.engine_id IS NULL OR NEW.trim_id IS NULL OR NEW.year IS NULL THEN RAISE(ABORT, 'vehicle variant requires generation, engine, trim and year') END;
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM vehicle_generations g WHERE g.id = NEW.generation_id AND NEW.year BETWEEN g.start_year AND COALESCE(g.end_year, 9999)) THEN RAISE(ABORT, 'generation year mismatch') END;
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM vehicle_engines e WHERE e.id = NEW.engine_id AND e.generation_id = NEW.generation_id AND NEW.year BETWEEN e.start_year AND COALESCE(e.end_year, 9999)) THEN RAISE(ABORT, 'engine year mismatch') END;
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM vehicle_trims t WHERE t.id = NEW.trim_id AND t.generation_id = NEW.generation_id AND NEW.year BETWEEN t.start_year AND COALESCE(t.end_year, 9999)) THEN RAISE(ABORT, 'trim year mismatch') END;
END;
--> statement-breakpoint
CREATE TRIGGER vehicle_variant_year_update BEFORE UPDATE OF generation_id, engine_id, trim_id, year ON vehicle_variants
WHEN NEW.generation_id IS NOT NULL OR NEW.engine_id IS NOT NULL OR NEW.trim_id IS NOT NULL
BEGIN
  SELECT CASE WHEN NEW.generation_id IS NULL OR NEW.engine_id IS NULL OR NEW.trim_id IS NULL OR NEW.year IS NULL THEN RAISE(ABORT, 'vehicle variant requires generation, engine, trim and year') END;
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM vehicle_generations g WHERE g.id = NEW.generation_id AND NEW.year BETWEEN g.start_year AND COALESCE(g.end_year, 9999)) THEN RAISE(ABORT, 'generation year mismatch') END;
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM vehicle_engines e WHERE e.id = NEW.engine_id AND e.generation_id = NEW.generation_id AND NEW.year BETWEEN e.start_year AND COALESCE(e.end_year, 9999)) THEN RAISE(ABORT, 'engine year mismatch') END;
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM vehicle_trims t WHERE t.id = NEW.trim_id AND t.generation_id = NEW.generation_id AND NEW.year BETWEEN t.start_year AND COALESCE(t.end_year, 9999)) THEN RAISE(ABORT, 'trim year mismatch') END;
END;
