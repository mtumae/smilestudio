CREATE TABLE IF NOT EXISTS "smilestudio_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "smilestudio_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
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
	"status" varchar(255) NOT NULL,
	"google_event_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversation_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'patient' NOT NULL,
	"last_read" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" text,
	"type" text DEFAULT 'support' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'sent' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_patients" (
	"customer_id" varchar(255) NOT NULL,
	"count" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_post" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "smilestudio_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256),
	"title" varchar(256),
	"body" varchar,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_reset_link" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "smilestudio_reset_link_token_unique" UNIQUE("token")
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
	"user_id" text,
	"rating" integer NOT NULL,
	"feedback" text,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"isSet" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phonenumber" varchar(255),
	"role" varchar(255) DEFAULT 'client' NOT NULL,
	"password" text,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	CONSTRAINT "smilestudio_user_email_unique" UNIQUE("email"),
	CONSTRAINT "smilestudio_user_phonenumber_unique" UNIQUE("phonenumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "smilestudio_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_account" ADD CONSTRAINT "smilestudio_account_user_id_smilestudio_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_smilestudio_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_smilestudio_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_patients" ADD CONSTRAINT "smilestudio_patients_customer_id_smilestudio_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_post" ADD CONSTRAINT "smilestudio_post_created_by_smilestudio_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_session" ADD CONSTRAINT "smilestudio_session_user_id_smilestudio_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "smilestudio_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointment_start_time_idx" ON "smilestudio_appointments" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointment_status_idx" ON "smilestudio_appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointment_type_idx" ON "smilestudio_appointments" USING btree ("appointment_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "smilestudio_post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "smilestudio_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "smilestudio_session" USING btree ("user_id");