CREATE TABLE `folder` (
	`id` text PRIMARY KEY,
	`workspace_id` text,
	`author_id` text NOT NULL,
	`parent_id` text,
	`string` text NOT NULL UNIQUE,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_folder_workspace_id_workspace _id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace `(`id`),
	CONSTRAINT `fk_folder_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `note` (
	`id` text PRIMARY KEY,
	`workspace_id` text,
	`folder_id` text NOT NULL,
	`author_id` text NOT NULL,
	`name` text NOT NULL UNIQUE,
	`is_pinned` integer DEFAULT false NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`is_trash` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_note_workspace_id_workspace _id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace `(`id`),
	CONSTRAINT `fk_note_folder_id_folder_id_fk` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`id`) ON DELETE SET NULL,
	CONSTRAINT `fk_note_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `note_share` (
	`id` text PRIMARY KEY,
	`note_id` text NOT NULL,
	`access_level` text DEFAULT 'public_read' NOT NULL,
	`password_hash` text,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_note_share_note_id_note_id_fk` FOREIGN KEY (`note_id`) REFERENCES `note`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `note_tag` (
	`note_id` text NOT NULL,
	`tag_id` text NOT NULL,
	CONSTRAINT `note_tag_pk` PRIMARY KEY(`note_id`, `tag_id`),
	CONSTRAINT `fk_note_tag_note_id_note_id_fk` FOREIGN KEY (`note_id`) REFERENCES `note`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_note_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY,
	`string` text NOT NULL UNIQUE,
	`workspace_id` text,
	CONSTRAINT `fk_tag_workspace_id_workspace _id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace `(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `workspace ` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL UNIQUE,
	`description` text,
	`color` text,
	`owner_id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_workspace _owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY,
	`userId` text NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`password` text,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_account`(`id`, `userId`, `accountId`, `providerId`, `password`, `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `createdAt`, `updatedAt`) SELECT `id`, `userId`, `accountId`, `providerId`, `password`, `accessToken`, `refreshToken`, `idToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `createdAt`, `updatedAt` FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY,
	`userId` text NOT NULL,
	`token` text NOT NULL UNIQUE,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_session`(`id`, `userId`, `token`, `expiresAt`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt`) SELECT `id`, `userId`, `token`, `expiresAt`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt` FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;