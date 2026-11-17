"use client";

import { createContext, useContext } from "react";
import type { Category, SiteSettings } from "../lib/types";

type SiteContextValue = { site: SiteSettings; categories: Category[] };

const SiteContext = createContext<SiteContextValue | null>(null);

/** Business details and categories from the admin, for client components. */
export function SiteProvider({
  site,
  categories,
  children,
}: SiteContextValue & { children: React.ReactNode }) {
  return <SiteContext.Provider value={{ site, categories }}>{children}</SiteContext.Provider>;
}

function useSiteContext() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("Site context is missing: wrap the app in <SiteProvider>");
  return ctx;
}

/** Business details: name, WhatsApp number, phones, email, address, socials. */
export function useSite() {
  return useSiteContext().site;
}

/** All visible categories, in admin order. */
export function useCategories() {
  return useSiteContext().categories;
}

/** Display label for a category slug (falls back to the slug). */
export function useCategoryLabel(slug: string | undefined) {
  const categories = useSiteContext().categories;
  if (!slug) return undefined;
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}
