CREATE TABLE "deal_access_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"party_id" uuid NOT NULL,
	"deal_id" uuid NOT NULL,
	"role" "party_role" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "deal_access_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "deal_access_tokens" ADD CONSTRAINT "deal_access_tokens_party_id_parties_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deal_access_tokens" ADD CONSTRAINT "deal_access_tokens_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "deal_access_tokens_party_id_idx" ON "deal_access_tokens" USING btree ("party_id");