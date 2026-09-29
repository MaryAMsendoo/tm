import { siteConfig } from "./data";
import type { EnquiryItem } from "./enquiry-store";

export function whatsappUrl(text: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function generalWhatsappUrl() {
  return whatsappUrl(
    `Hello ${siteConfig.shortName}, I'd like to make an enquiry.`,
  );
}

/** One product: use this for the "Ask for price" button on a product card. */
export function productWhatsappUrl(item: Pick<EnquiryItem, "name" | "category">) {
  const cat = item.category ? ` (${item.category})` : "";
  return whatsappUrl(
    `Hello ${siteConfig.shortName}, I'd like a price for the ${item.name}${cat}. Is it available?`,
  );
}

export function buildEnquiryText(items: EnquiryItem[]) {
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.name}${item.category ? ` (${item.category})` : ""}`,
  );
  return [
    `Hello ${siteConfig.shortName}, I'd like a price for:`,
    "",
    ...lines,
    "",
    "Please let me know the price and availability. Thank you.",
  ].join("\n");
}

export function enquiryWhatsappUrl(items: EnquiryItem[]) {
  return whatsappUrl(buildEnquiryText(items));
}

export function enquiryEmailUrl(items: EnquiryItem[]) {
  const subject = `Price enquiry: ${items.length} item${items.length === 1 ? "" : "s"}`;
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEnquiryText(items))}`;
}