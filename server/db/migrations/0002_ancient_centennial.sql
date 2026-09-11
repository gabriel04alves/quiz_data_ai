DROP INDEX `rounds_user_id_game_date_unique`;--> statement-breakpoint
CREATE INDEX `rounds_user_id_game_date_idx` ON `rounds` (`user_id`,`game_date`);