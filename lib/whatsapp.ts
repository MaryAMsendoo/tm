import type { EnquiryItem } from "./enquiry-store";
import type { SiteSettings } from "./types";

type Site = Pick<SiteSettings, "whatsapp" | "shortName" | "email">;

export function whatsappUrl(site: Site, text: string) {
  const number = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function emailUrl(site: Site, subject: string, body: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Plain "chat with us" link, used where no request is being made. */
export function generalWhatsappUrl(site: Site) {
  return whatsappUrl(site, `Hello ${site.shortName}, I'd like to request a quote.`);
}

/** Message for one product: the "WhatsApp" button on a product card. */
export function productEnquiryText(site: Site, item: Pick<EnquiryItem, "name" | "category">) {
  const cat = item.category ? ` (${item.category})` : "";
  return `Hello ${site.shortName}, I'd like a quote for the ${item.name}${cat}. Is it available?`;
}

/** Message for the whole quote list. */
export function quoteListText(site: Site, items: EnquiryItem[]) {
  const lines = items.map((item, i) => {
    const entry = `${i + 1}. ${item.name}${item.category ? ` (${item.category})` : ""}`;
    if (!item.image) return entry;

    const imageUrl =
      item.image.startsWith("http") || typeof window === "undefined"
        ? item.image
        : new URL(item.image, window.location.origin).toString();

    return `${entry}\n   Reference image: ${imageUrl}`;
  });

  return [
    `Hello ${site.shortName},`,
    "I'd like to request a quote for the following pieces:",
    "",
    ...lines,
    "",
    "Please share the price, finish options and availability for each item.",
    "Thank you.",
  ].join("\n");
}
