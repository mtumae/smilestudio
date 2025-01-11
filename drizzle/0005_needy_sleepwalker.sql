CREATE TABLE IF NOT EXISTS "smilestudio_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'unread' NOT NULL,
	"responded_by" varchar(255),
	"response_content" text,
	"response_time" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_messages" ADD CONSTRAINT "smilestudio_messages_responded_by_smilestudio_user_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
