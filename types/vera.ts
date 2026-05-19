import { z } from "zod";
import { CurrencySchema, DisputeReasonSchema } from "./deal";

export const VeraSessionTypeSchema = z.enum([
  "BUYER_ONBOARDING",
  "SELLER_ONBOARDING",
  "JOINT_SIGNOFF",
  "VOICE_RECEIPT",
  "DISPUTE",
]);
export type VeraSessionType = z.infer<typeof VeraSessionTypeSchema>;

const BaseToolInputSchema = z.object({
  deal_id: z.string().optional(),
  session_id: z.string().optional(),
});

export const ExtractTermsInputSchema = BaseToolInputSchema.extend({
  user_input: z.string().min(1),
});
export const ExtractTermsOutputSchema = z.object({
  terms: z.object({
    item: z.string().optional(),
    quantity: z.number().optional(),
    condition: z.string().optional(),
    counterparty: z.string().optional(),
    amount: z.number().optional(),
    currency: CurrencySchema.optional(),
    deadline: z.string().optional(),
    delivery_method: z.string().optional(),
    notes: z.string().optional(),
  }),
});

const SpokenTextOutputSchema = z.object({
  spoken_text: z.string(),
});

export const ReadContractBackInputSchema = BaseToolInputSchema;
export const ReadContractBackOutputSchema = SpokenTextOutputSchema;

export const ReadBuyerTermsInputSchema = BaseToolInputSchema;
export const ReadBuyerTermsOutputSchema = SpokenTextOutputSchema;

export const CommitBuyerSideInputSchema = BaseToolInputSchema;
export const CommitBuyerSideOutputSchema = z.object({
  success: z.boolean(),
  deal_id: z.string(),
});

export const CommitSellerSideInputSchema = BaseToolInputSchema;
export const CommitSellerSideOutputSchema = z.object({
  success: z.boolean(),
  deal_id: z.string(),
});

export const ExtractCounterInputSchema = BaseToolInputSchema.extend({
  changes: z.string().min(1),
});
export const ExtractCounterOutputSchema = z.object({
  counter_terms: z.object({
    item: z.string().optional(),
    quantity: z.number().optional(),
    condition: z.string().optional(),
    amount: z.number().optional(),
    currency: CurrencySchema.optional(),
    deadline: z.string().optional(),
    delivery_method: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const LockEscrowInputSchema = BaseToolInputSchema;
export const LockEscrowOutputSchema = z.object({
  success: z.boolean(),
  amount: z.number(),
  currency: CurrencySchema,
  stripe_pi_id: z.string(),
  expires_at: z.string().datetime(),
});

export const ReleaseEscrowInputSchema = BaseToolInputSchema;
export const ReleaseEscrowOutputSchema = z.object({
  success: z.boolean(),
  transfer_id: z.string(),
  amount: z.number(),
  currency: CurrencySchema,
  settles_by: z.string().datetime(),
});

export const OpenDisputeInputSchema = BaseToolInputSchema.extend({
  reason: z.string().min(1),
  reason_code: DisputeReasonSchema.optional(),
});
export const OpenDisputeOutputSchema = z.object({
  success: z.boolean(),
  dispute_id: z.string(),
  expected_resolution_time: z.string(),
});

export const ReplayAgreementInputSchema = BaseToolInputSchema;
export const ReplayAgreementOutputSchema = SpokenTextOutputSchema;

export const RefundDealInputSchema = BaseToolInputSchema.extend({
  reason: z.string().optional(),
});
export const RefundDealOutputSchema = z.object({
  success: z.boolean(),
  refund_id: z.string(),
  deal_status: z.literal("REFUNDED"),
  spoken_text: z.string(),
});

export const GatherDisputeEvidenceInputSchema = z.object({
  deal_id: z.string().min(1),
  session_id: z.string().optional(),
  user_summary: z.string().min(1),
  dispute_id: z.string().optional(),
});
export const GatherDisputeEvidenceOutputSchema = z.object({
  success: z.boolean(),
});

export const FlagForReviewInputSchema = z.object({
  deal_id: z.string().min(1),
  session_id: z.string().optional(),
  reason: z.string().min(1),
});
export const FlagForReviewOutputSchema = z.object({
  success: z.boolean(),
  reviewer_will_contact_by: z.string().datetime(),
});

export type ExtractTermsInput = z.infer<typeof ExtractTermsInputSchema>;
export type ExtractTermsOutput = z.infer<typeof ExtractTermsOutputSchema>;
export type ReadContractBackOutput = z.infer<typeof ReadContractBackOutputSchema>;
export type ReadBuyerTermsOutput = z.infer<typeof ReadBuyerTermsOutputSchema>;
export type CommitBuyerSideOutput = z.infer<typeof CommitBuyerSideOutputSchema>;
export type CommitSellerSideOutput = z.infer<typeof CommitSellerSideOutputSchema>;
export type ExtractCounterInput = z.infer<typeof ExtractCounterInputSchema>;
export type ExtractCounterOutput = z.infer<typeof ExtractCounterOutputSchema>;
export type LockEscrowOutput = z.infer<typeof LockEscrowOutputSchema>;
export type ReleaseEscrowOutput = z.infer<typeof ReleaseEscrowOutputSchema>;
export type OpenDisputeInput = z.infer<typeof OpenDisputeInputSchema>;
export type OpenDisputeOutput = z.infer<typeof OpenDisputeOutputSchema>;
export type ReplayAgreementOutput = z.infer<typeof ReplayAgreementOutputSchema>;
export type RefundDealInput = z.infer<typeof RefundDealInputSchema>;
export type RefundDealOutput = z.infer<typeof RefundDealOutputSchema>;
export type GatherDisputeEvidenceInput = z.infer<typeof GatherDisputeEvidenceInputSchema>;
export type GatherDisputeEvidenceOutput = z.infer<typeof GatherDisputeEvidenceOutputSchema>;
export type FlagForReviewInput = z.infer<typeof FlagForReviewInputSchema>;
export type FlagForReviewOutput = z.infer<typeof FlagForReviewOutputSchema>;
