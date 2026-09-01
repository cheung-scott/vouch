CREATE TYPE "public"."deal_status" AS ENUM('DRAFT', 'AWAITING_SELLER', 'AGREED', 'IN_ESCROW', 'RELEASED', 'REFUNDED', 'DISPUTED', 'REVIEWING', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."issuing_card_status" AS ENUM('frozen', 'active', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."party_role" AS ENUM('BUYER', 'SELLER');--> statement-breakpoint
CREATE TABLE "deals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"status" "deal_status" NOT NULL,
	"terms" jsonb NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_transfer_id" text,
	"stripe_refund_id" text,
	"stripe_issuing_cardholder_id" text,
	"stripe_issuing_card_id" text,
	"stripe_issuing_card_status" "issuing_card_status",
	"allowed_merchant_category" text,
	"spend_cap" integer,
	"voice_agreement_recording_url" text,
	"vera_session_ids" text[] DEFAULT '{}' NOT NULL,
	"vera_summary" text,
	"vera_eval_results" jsonb,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"locked_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	CONSTRAINT "deals_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "parties" (
	"id" uuid PRIMARY KEY NOT NULL,
	"deal_id" uuid NOT NULL,
	"role" "party_role" NOT NULL,
	"first_name" text NOT NULL,
	"email" text,
	"phone" text,
	"stripe_customer_id" text,
	"stripe_account_id" text,
	"identity_verified" boolean DEFAULT false NOT NULL,
	"committed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "parties" ADD CONSTRAINT "parties_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "deals_created_at_idx" ON "deals" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "deals_status_idx" ON "deals" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "parties_deal_role_uidx" ON "parties" USING btree ("deal_id","role");--> statement-breakpoint
CREATE INDEX "parties_deal_id_idx" ON "parties" USING btree ("deal_id");