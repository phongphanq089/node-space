ALTER TABLE `workspace ` RENAME TO `workspace`;--> statement-breakpoint
ALTER TABLE `folder` RENAME COLUMN `string` TO `name`;--> statement-breakpoint
ALTER TABLE `tag` RENAME COLUMN `string` TO `name`;--> statement-breakpoint
ALTER TABLE `folder` ADD `color` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_folder` (
	`id` text PRIMARY KEY,
	`workspace_id` text,
	`author_id` text NOT NULL,
	`parent_id` text,
	`name` text NOT NULL,
	`color` text,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_folder_workspace_id_workspace _id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`id`),
	CONSTRAINT `fk_folder_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_folder`(`id`, `workspace_id`, `author_id`, `parent_id`, `name`, `image`, `createdAt`, `updatedAt`) SELECT `id`, `workspace_id`, `author_id`, `parent_id`, `name`, `image`, `createdAt`, `updatedAt` FROM `folder`;--> statement-breakpoint
DROP TABLE `folder`;--> statement-breakpoint
ALTER TABLE `__new_folder` RENAME TO `folder`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_note` (
	`id` text PRIMARY KEY,
	`workspace_id` text,
	`folder_id` text NOT NULL,
	`author_id` text NOT NULL,
	`name` text NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`is_trash` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_note_workspace_id_workspace _id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`id`),
	CONSTRAINT `fk_note_folder_id_folder_id_fk` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`id`) ON DELETE SET NULL,
	CONSTRAINT `fk_note_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_note`(`id`, `workspace_id`, `folder_id`, `author_id`, `name`, `is_pinned`, `is_archived`, `is_trash`, `created_at`, `updated_at`) SELECT `id`, `workspace_id`, `folder_id`, `author_id`, `name`, `is_pinned`, `is_archived`, `is_trash`, `created_at`, `updated_at` FROM `note`;--> statement-breakpoint
DROP TABLE `note`;--> statement-breakpoint
ALTER TABLE `__new_note` RENAME TO `note`;--> statement-breakpoint
PRAGMA foreign_keys=ON;