import type { Deal, DealTerms } from "@/types/deal";

const CURRENCY_SPOKEN: Record<DealTerms["currency"], string> = {
  GBP: "pounds",
  USD: "dollars",
  EUR: "euros",
};

function spokenAmount(terms: DealTerms): string {
  const major = (terms.amountMinor / 100).toLocaleString("en-GB", {
    minimumFractionDigits: terms.amountMinor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${major} ${CURRENCY_SPOKEN[terms.currency]}`;
}

function spokenDeadline(terms: DealTerms): string | null {
  if (!terms.deadline) return null;
  const d = new Date(terms.deadline);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function composeContractRecitation(deal: Deal): string {
  const { terms, buyer, seller } = deal;
  const lines: string[] = [];

  lines.push("OK. Let me read this back.");

  const qtyPrefix = terms.quantity > 1 ? `${terms.quantity} ` : "one ";
  const conditionFragment = terms.condition ? `, ${terms.condition}` : "";
  const itemPhrase = `${qtyPrefix}${terms.item}${conditionFragment}`;

  lines.push(
    `${buyer.firstName} agrees to pay ${spokenAmount(terms)} for ${itemPhrase}, sold by ${seller.firstName}.`,
  );

  const deadline = spokenDeadline(terms);
  if (deadline && terms.deliveryMethod) {
    lines.push(`Delivery is via ${terms.deliveryMethod} by ${deadline}.`);
  } else if (deadline) {
    lines.push(`Delivery by ${deadline}.`);
  } else if (terms.deliveryMethod) {
    lines.push(`Delivery via ${terms.deliveryMethod}.`);
  }

  if (terms.notes) {
    lines.push(`On the record: ${terms.notes}.`);
  }

  lines.push("Money releases when the buyer voice-confirms receipt.");
  lines.push(
    `${buyer.firstName}, say "I confirm" if those terms are what you want me to send to ${seller.firstName}.`,
  );

  return lines.join(" ");
}

export function composeBuyerTermsRecitation(deal: Deal): string {
  const { terms, buyer, seller } = deal;
  const lines: string[] = [];

  lines.push(`${seller.firstName}, here are the terms ${buyer.firstName} proposed.`);

  const qtyPrefix = terms.quantity > 1 ? `${terms.quantity} ` : "one ";
  const conditionFragment = terms.condition ? `, ${terms.condition}` : "";
  lines.push(
    `${buyer.firstName} will pay ${spokenAmount(terms)} for ${qtyPrefix}${terms.item}${conditionFragment}.`,
  );

  const deadline = spokenDeadline(terms);
  if (deadline && terms.deliveryMethod) {
    lines.push(`Delivery via ${terms.deliveryMethod} by ${deadline}.`);
  } else if (deadline) {
    lines.push(`Delivery by ${deadline}.`);
  } else if (terms.deliveryMethod) {
    lines.push(`Delivery via ${terms.deliveryMethod}.`);
  }

  if (terms.notes) {
    lines.push(`On the record: ${terms.notes}.`);
  }

  lines.push(
    `${seller.firstName}, does that match what you and ${buyer.firstName} talked about? If yes, say "I agree". If anything's wrong, tell me what to change.`,
  );

  return lines.join(" ");
}

export function composeAgreementReplay(deal: Deal): string {
  const { terms, buyer, seller } = deal;
  const qtyPrefix = terms.quantity > 1 ? `${terms.quantity} ` : "one ";
  const conditionFragment = terms.condition ? `, ${terms.condition}` : "";
  return [
    `Let me play back what we originally agreed on deal ${deal.reference}.`,
    `${buyer.firstName} agreed to pay ${spokenAmount(terms)} for ${qtyPrefix}${terms.item}${conditionFragment}, sold by ${seller.firstName}.`,
    terms.deliveryMethod
      ? `Delivery via ${terms.deliveryMethod}${spokenDeadline(terms) ? ` by ${spokenDeadline(terms)}` : ""}.`
      : null,
    terms.notes ? `On the record: ${terms.notes}.` : null,
    `Compared to what we agreed, what specifically is different?`,
  ]
    .filter((s): s is string => s !== null)
    .join(" ");
}
