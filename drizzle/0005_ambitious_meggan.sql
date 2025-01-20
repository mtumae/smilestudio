ALTER TABLE "smilestudio_appointments" ADD COLUMN "status" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "smilestudio_patients" ADD COLUMN "customer_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "smilestudio_patients" ADD COLUMN "count" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smilestudio_patients" ADD CONSTRAINT "smilestudio_patients_customer_id_smilestudio_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."smilestudio_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "smilestudio_patients" DROP COLUMN IF EXISTS "id";