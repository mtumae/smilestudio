CREATE TABLE IF NOT EXISTS "smilestudio_patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_revenues" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_satisfaction_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"date" timestamp NOT NULL
);
