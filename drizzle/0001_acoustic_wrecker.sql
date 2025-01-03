CREATE TABLE IF NOT EXISTS "smilestudio_appointment_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"duration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_name" varchar(255) NOT NULL,
	"patient_email" varchar(255) NOT NULL,
	"appointment_type" varchar(255) NOT NULL,
	"date" timestamp NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"google_event_id" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "smilestudio_user" ADD CONSTRAINT "smilestudio_user_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "smilestudio_user" ADD CONSTRAINT "smilestudio_user_phonenumber_unique" UNIQUE("phonenumber");