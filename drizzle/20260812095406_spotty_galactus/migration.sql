ALTER TABLE `folder` ADD `is_favorite` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `note` ADD `is_favorite` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `workspace` ADD `is_favorite` integer DEFAULT false NOT NULL;