CREATE TABLE `chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`source_file` text NOT NULL,
	`heading` text,
	`content` text NOT NULL,
	`content_hash` text NOT NULL,
	`times_used` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chunks_content_hash_unique` ON `chunks` (`content_hash`);--> statement-breakpoint
CREATE INDEX `chunks_topic_times_used_idx` ON `chunks` (`topic`,`times_used`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`chunk_id` text NOT NULL,
	`topic` text NOT NULL,
	`difficulty` text NOT NULL,
	`stem` text NOT NULL,
	`options` text NOT NULL,
	`correct_index` integer NOT NULL,
	`explanation` text NOT NULL,
	`source_file` text NOT NULL,
	`reports` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`chunk_id`) REFERENCES `chunks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `questions_active_idx` ON `questions` (`active`);--> statement-breakpoint
CREATE TABLE `round_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`round_id` text NOT NULL,
	`question_id` text NOT NULL,
	`position` integer NOT NULL,
	`time_limit_ms` integer NOT NULL,
	`served_at` integer,
	`chosen_index` integer,
	`is_correct` integer,
	`points` integer,
	`answered_at` integer,
	FOREIGN KEY (`round_id`) REFERENCES `rounds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rounds` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`topic` text,
	`game_date` text NOT NULL,
	`started_at` integer NOT NULL,
	`played_at` integer,
	`score` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rounds_user_id_game_date_unique` ON `rounds` (`user_id`,`game_date`);--> statement-breakpoint
CREATE INDEX `rounds_played_at_idx` ON `rounds` (`played_at`);--> statement-breakpoint
CREATE TABLE `seen_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`chunk_id` text NOT NULL,
	`seen_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chunk_id`) REFERENCES `chunks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `seen_chunks_user_id_seen_at_idx` ON `seen_chunks` (`user_id`,`seen_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);