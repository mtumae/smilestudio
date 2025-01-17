CREATE TABLE IF NOT EXISTS "smilestudio_reset_link" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "smilestudio_reset_link_token_unique" UNIQUE("token")
);
