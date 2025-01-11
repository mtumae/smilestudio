CREATE TABLE IF NOT EXISTS "smilestudio_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"isSet" boolean DEFAULT true
);
