/**
 * Phone number helpers. Visitors type numbers in many ways
 * ("0803 123 4567", "+234 803...", "234803..."); WhatsApp links need the
 * international form without "+".
 */

/** Digits for a wa.me link, assuming Nigeria (+234) for local 0-prefixed numbers. */
export function toWhatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  return digits;
}

export function customerWhatsappUrl(phone: string, text = "") {
  const number = toWhatsappNumber(phone);
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
