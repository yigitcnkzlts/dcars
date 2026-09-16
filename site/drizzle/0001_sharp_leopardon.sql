CREATE TABLE `valuation_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_id` integer NOT NULL,
	`object_key` text NOT NULL,
	`area` text NOT NULL,
	`file_name` text NOT NULL,
	`content_type` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `valuation_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `valuation_photos_object_key_unique` ON `valuation_photos` (`object_key`);