"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { activeCategories, categories, products, siteConfig, type Product } from "../../lib/data";
import { whatsappUrl } from "../../lib/whatsapp";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { WordReveal } from "../../components/ui/WordReveal";
import { ProductCard } from "../../components/shop/ProductCard";
import { QuickView } from "../../components/shop/QuickView";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const requested = params.get("category");
  const category = activeCategories.some((c) => c.slug === requested)
    ? requested
    : null;

  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<Product | null>(null);

  const setCategory = (slug: string | null) => {
    router.replace(slug ? `${pathname}?category=${slug}` : pathname, {
      scroll: false,
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      const label =
        categories.find((c) => c.slug === p.category)?.label ?? "";
      return `${p.name} ${p.description} ${label}`.toLowerCase().includes(q);
    });
  }, [category, query]);

  const chips = [
    { slug: null as string | null, label: "All", count: products.length },
    ...activeCategories.map((c) => ({
      slug: c.slug as string | null,
      label: c.label,
      count: products.filter((p) => p.category === c.slug).length,
    })),
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="canvas" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 lg:px-8 lg:pb-28 lg:pt-16">
          <WordReveal
            as="h1"
            text="Everything we have built."
            className="font-display text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] text-[var(--brand-wood)]"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
            className="mt-5 max-w-lg text-base leading-7 text-[var(--text-muted)]"
          >
            Prices are given on request, because each piece is made to your
            size and finish. Add what you like to your enquiry list.
          </motion.p>

          {/* Controls */}
          <div className="mt-10 flex flex-col gap-5 border-y border-[var(--border-subtle)] py-5 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter by room"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {chips.map((c) => {
                const on = c.slug === category;
                return (
                  <button
                    key={c.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCategory(c.slug)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]",
                      on
                        ? "border-[var(--brand-wood)] bg-[var(--brand-wood)] text-[var(--brand-ivory)]"
                        : "border-[rgba(77,45,36,0.25)] text-[var(--brand-wood)] hover:bg-[rgba(77,45,36,0.06)]",
                    )}
                  >
                    {c.label}
                    <span className={cn("ml-1.5 tabular-nums", on ? "opacity-70" : "text-[var(--text-subtle)]")}>
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full lg:max-w-xs">
              <span className="sr-only">Search pieces</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search, for example wardrobe"
                className="w-full rounded-full border border-[rgba(77,45,36,0.25)] bg-transparent py-2.5 pl-10 pr-10 text-sm text-[var(--brand-wood)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-subtle)] hover:bg-[rgba(77,45,36,0.08)]"
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>

          <p
            aria-live="polite"
            className="mt-5 text-sm tabular-nums text-[var(--text-subtle)]"
          >
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>

          {/* Grid */}
          {results.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.04 }}
                >
                  <ProductCard product={p} onQuickView={setQuick} />
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 max-w-md">
              <p className="font-display text-3xl text-[var(--brand-wood)]">
                Nothing matches that yet.
              </p>
              <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                We make to order, so it may still be something we can build.
                Send us a photo or a description.
              </p>
              <a
                href={whatsappUrl(
                  `Hello ${siteConfig.shortName}, I was looking for ${query.trim() || "a piece"} and could not find it on the site.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-wood)]"
              >
                <FaWhatsapp size={17} />
                <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                  Ask on WhatsApp
                </span>
              </a>
            </div>
          )}
        </div>
      </section>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </MotionConfig>
  );
}