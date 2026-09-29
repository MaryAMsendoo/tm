/**
 * Central "database" for the site.
 * Everything the UI shows lives here, so when a real backend arrives
 * only this layer needs to change.
 *
 * Products come next (see the Product type we'll add in the next step).
 */

export type SocialKey =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "x"
  | "linkedin"
  | "youtube";

export const siteConfig = {
  name: "TM Artisan Enterprise",
  shortName: "TM Artisan",
  tagline: "Furniture made by hand, made for your space.",
  description:
    "Custom and ready-made furniture, crafted in Abuja. Tell us what you have in mind and we'll send you a price.",

  // TODO: confirm the exact logo filename inside /public
  logo: "/TM-logo.jpeg",

  // TODO: confirm with the owner. WhatsApp number in international format,
  // no "+" and no spaces (Nigeria = 234, drop the leading 0).
  whatsapp: "2349168549455",
  // TODO: replace with the real business email
  email: "tm@gmail.com",

  phones: ["09168549455", "07012724991"],
  address: "Gosa, Airport Road, Abuja, FCT, Nigeria",

  // Leave href empty until you have the real link; empty ones are hidden.
  socials: [
    { key: "facebook", label: "Facebook", href: "" },
    { key: "instagram", label: "Instagram", href: "" },
    { key: "tiktok", label: "TikTok", href: "" },
    { key: "x", label: "X", href: "" },
    { key: "linkedin", label: "LinkedIn", href: "" },
    { key: "youtube", label: "YouTube", href: "" },
  ] as { key: SocialKey; label: string; href: string }[],
};

export type NavLink = { label: string; href: string };

// Adjust hrefs to match the dummy pages you already created.
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Custom designs", href: "/custom-designs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type Category = { slug: string; label: string };

export const categories: Category[] = [
  { slug: "living-room", label: "Living room" },
  { slug: "bedroom", label: "Bedroom" },
  { slug: "office", label: "Office" },
  { slug: "dining", label: "Dining" },
  { slug: "kitchen", label: "Kitchen" },
  { slug: "outdoor", label: "Outdoor" },
  { slug: "glass", label: "Glass products" },
  { slug: "custom", label: "Custom designs" },
];