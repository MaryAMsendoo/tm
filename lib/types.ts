/**
 * Data shapes the public pages render. Produced by lib/server/content.ts
 * from the database; plain objects, safe to pass to client components.
 */
export type { SiteSettings, HeroSettings, AboutSettings, FounderSettings, SocialKey } from "./content-schemas";
export type { MediaRef } from "../db/schema";

export type Category = { slug: string; label: string };

export type Product = {
  /** Product slug. */
  id: string;
  name: string;
  /** Category slug. */
  category: string;
  /** Image URLs for cards and quick view (a video contributes its poster). */
  images: string[];
  description: string;
  dimensions?: string;
  materials?: string;
  customisable: boolean;
  featured?: boolean;
};

export type ShowroomArchiveItem = {
  /** Stable id used in the quote list, e.g. "media-42". */
  id: string;
  /** Product slug, used to mix series evenly in the gallery. */
  series: string;
  title: string;
  /** Category slug. */
  category: string;
  /** Image or video URL. */
  image: string;
  poster?: string;
  type: "image" | "video";
  description: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  /** Category slug, or "" when the category was removed. */
  category: string;
  location?: string;
  type: "image" | "video";
  src: string;
  poster?: string;
};

export type HeroSlide = {
  id: string;
  name: string;
  category?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  tag: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail?: string;
  avatar?: string;
};

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Custom designs", href: "/custom-designs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
