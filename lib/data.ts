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

  logo: "/TM-logo.jpeg",

  whatsapp: "+2348057789650",
  // TODO: replace with the real business email
  email: "tm@gmail.com",

  phones: ["+2349168549455", "+2347012724991"],
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

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  name?: string;
  category?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "living",
    name: "Living room collection",
    category: "living-room",
    eyebrow: "Handcrafted comfort",
    title: "Furniture that turns everyday rooms into a statement.",
    description:
      "Custom-made sofas, statement chairs, and refined pieces designed for relaxed living and elevated spaces.",
    image: "/f1.png",
    tag: "Living room",
  },
  {
    id: "dining",
    eyebrow: "Made for gathering",
    title: "Dining pieces that bring warmth, elegance, and character.",
    description:
      "Modern dining sets and tailored wood finishes that give your home a warm, welcoming presence.",
    image: "/f5.png",
    tag: "Dining",
    
  },
  {
    id: "bedroom",
    eyebrow: "Quiet luxury",
    title: "Bedrooms designed for rest, rhythm, and personal style.",
    description:
      "Thoughtful bedroom furniture, custom details, and soft textures that create a more luxurious everyday routine.",
    image: "/f9.png",
    tag: "Bedroom",
  },
];

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

export type ShowcaseSlide = {
  id: string;
  name: string;
  category?: string;
  image: string;
};

// Used by the arch frame in components/home/Hero.tsx
export const showcaseSlides: ShowcaseSlide[] = [
  { id: "showcase-living", name: "Living room collection", image: "/f1.png" },
  { id: "showcase-dining", name: "Dining collection", image: "/f5.png" },
  { id: "showcase-bedroom", name: "Bedroom collection", image: "/f9.png" },
];