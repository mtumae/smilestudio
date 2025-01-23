CREATE TABLE IF NOT EXISTS "smilestudio_conversation_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"last_read" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smilestudio_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "smilestudio_typing_indicators";--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP CONSTRAINT "smilestudio_messages_customer_id_smilestudio_user_id_fk";
--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP CONSTRAINT "smilestudio_messages_responded_by_smilestudio_user_id_fk";
--> statement-breakpoint
ALTER TABLE "smilestudio_messages" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "smilestudio_messages" ALTER COLUMN "status" SET DEFAULT 'sent';--> statement-breakpoint
ALTER TABLE "smilestudio_messages" ADD COLUMN "conversation_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "smilestudio_messages" ADD COLUMN "sender_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_conversation_participants" ADD CONSTRAINT "smilestudio_conversation_participants_conversation_id_smilestudio_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."smilestudio_conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_conversation_participants" ADD CONSTRAINT "smilestudio_conversation_participants_user_id_smilestudio_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_messages" ADD CONSTRAINT "smilestudio_messages_conversation_id_smilestudio_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."smilestudio_conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_messages" ADD CONSTRAINT "smilestudio_messages_sender_id_smilestudio_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP COLUMN IF EXISTS "customer_id";--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP COLUMN IF EXISTS "responded_by";--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP COLUMN IF EXISTS "response_content";--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP COLUMN IF EXISTS "is_starred";--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP COLUMN IF EXISTS "response_time";--> statement-breakpoint
ALTER TABLE "smilestudio_messages" DROP COLUMN IF EXISTS "updated_at";