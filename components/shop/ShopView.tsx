"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import {
  categories,
  products,
  showroomArchiveItems,
  siteConfig,
  type Product,
  type ShowroomArchiveItem,
} from "../../lib/data";
import { productWhatsappUrl, whatsappUrl } from "../../lib/whatsapp";
import { useEnquiry } from "../../context/EnquiryContext";
import { PreviewVideo } from "../../components/ui/PreviewVideo";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { WordReveal } from "../../components/ui/WordReveal";
import { ProductCard } from "../../components/shop/ProductCard";
import { QuickView } from "../../components/shop/QuickView";

const EASE = [0.22, 1, 0.36, 1] as const;
const shopFilterCategories = categories.filter(
  (category) =>
    products.some((product) => product.category === category.slug) ||
    showroomArchiveItems.some((item) => item.category === category.slug),
);

export function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const requested = params.get("category");
  const category = shopFilterCategories.some((c) => c.slug === requested)
    ? requested
    : null;

  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<Product | null>(null);
  const [showroomView, setShowroomView] = useState<ShowroomArchiveItem | null>(null);
  const { toggle, has } = useEnquiry();

  useEffect(() => {
    if (!showroomView) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowroomView(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showroomView]);

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
    { slug: null as string | null, label: "All" },
    ...shopFilterCategories.map((c) => ({
      slug: c.slug as string | null,
      label: c.label,
    })),
  ];

  const filteredArchive = showroomArchiveItems.filter((item) =>
    category === null ? true : item.category === category,
  );
  const archiveImages = filteredArchive.filter((item) => item.type === "image");
  const archiveVideos = filteredArchive.filter((item) => item.type === "video");
  const mixedArchive = [
    ...archiveImages.map((item, index) => ({
      item,
      position: index / Math.max(archiveImages.length, 1),
      priority: 0,
    })),
    ...archiveVideos.map((item, index) => ({
      item,
      position: (index + 0.5) / Math.max(archiveVideos.length, 1),
      priority: 1,
    })),
  ]
    .sort((left, right) => left.position - right.position || left.priority - right.priority)
    .map(({ item }) => item);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-clip">
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

          {/* Sticky filters */}
          <div className="sticky top-16 z-40 -mx-5 mt-10 border-y border-[var(--border-subtle)] bg-[var(--surface-header)] px-5 py-3 shadow-[0_8px_24px_rgba(47,27,22,0.08)] backdrop-blur-xl lg:-mx-8 lg:px-8">
            <div className="flex items-center gap-3 lg:justify-between">
              <label className="sr-only" htmlFor="shop-category-mobile">
                Filter by room
              </label>
              <select
                id="shop-category-mobile"
                value={category ?? ""}
                onChange={(event) => setCategory(event.target.value || null)}
                className="min-w-0 flex-1 appearance-none rounded-full border border-[var(--border-subtle)] bg-[var(--brand-ivory)] px-3.5 py-2.5 text-sm text-[var(--brand-wood)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40 lg:hidden"
              >
                {chips.map((chip) => (
                  <option key={chip.label} value={chip.slug ?? ""}>
                    {chip.label}
                  </option>
                ))}
              </select>

              <div
                role="group"
                aria-label="Filter by room"
                className="hidden gap-2 lg:flex lg:flex-wrap"
              >
                {chips.map((chip) => {
                  const active = chip.slug === category;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(chip.slug)}
                      className={cn(
                        "shrink-0 rounded-full border px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]",
                        active
                          ? "border-[var(--brand-wood)] bg-[var(--brand-wood)] text-[var(--brand-ivory)]"
                          : "border-[rgba(77,45,36,0.25)] text-[var(--brand-wood)] hover:bg-[rgba(77,45,36,0.06)]",
                      )}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              <label className="relative block min-w-0 flex-[1.25] lg:w-full lg:max-w-xs lg:flex-none">
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
          </div>

         

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
                {category && filteredArchive.length > 0 && !query.trim()
                  ? `No shop listings for ${categories.find((c) => c.slug === category)?.label ?? category}.`
                  : "Nothing matches that yet."}
              </p>
              <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                {category && filteredArchive.length > 0 && !query.trim()
                  ? "Browse the matching pieces in the showroom below."
                  : "We make to order, so it may still be something we can build. Send us a photo or a description."}
              </p>
              {!(category && filteredArchive.length > 0 && !query.trim()) && (
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
              )}
            </div>
          )}

          <div className="mt-20 border-t border-[var(--border-subtle)] pt-12">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
                  Showroom archive
                </p>
                <h2 className="mt-2 font-display text-3xl text-[var(--brand-wood)] sm:text-4xl">
                  A curated gallery of the complete furniture archive
                </h2>
              </div>
              
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {mixedArchive.map((item) => {
                const category = categories.find((c) => c.slug === item.category)?.label ?? item.category;
                const added = has(item.id);
                const itemWhatsapp = productWhatsappUrl({ name: item.title, category });

                return (
                  <li
                    key={item.id}
                    className="group overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(201,166,106,0.65)] hover:shadow-[0_18px_42px_rgba(42,27,19,0.12)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--brand-cream)]">
                      {item.type === "video" ? (
                        <PreviewVideo
                          src={item.image}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image src={item.image} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" className="pointer-events-none object-cover transition duration-700 group-hover:scale-[1.04]" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowroomView(item)}
                        aria-label={`View ${item.title}`}
                        className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-black/45 via-transparent to-transparent p-5 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-gold)]"
                      >
                        <span className="rounded-full border border-white/35 bg-black/35 px-4 py-2 backdrop-blur-sm">
                          {item.type === "video" ? "Play video" : "View piece"}
                        </span>
                      </button>
                      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
                        <span className="rounded-full border border-white/20 bg-[rgba(16,15,12,0.58)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                          {category}
                        </span>
                        {item.type === "video" && (
                          <span className="rounded-full border border-white/20 bg-[rgba(16,15,12,0.42)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                            Video
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex min-h-[220px] flex-col p-4 sm:p-5">
                      <h3 className="font-display text-[1.35rem] leading-tight text-[var(--brand-wood)]">{item.title}</h3>

                      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>

                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <button
                          type="button"
                          aria-pressed={added}
                          onClick={() =>
                            toggle({
                              id: item.id,
                              name: item.title,
                              image: item.image,
                              category,
                            })
                          }
                          className={cn(
                            "inline-flex min-h-10 flex-1 items-center justify-center rounded-full px-3.5 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]",
                            added
                              ? "bg-[var(--brand-gold)] text-[var(--brand-wood-deep)]"
                              : "bg-[var(--brand-wood)] text-[var(--brand-ivory)] hover:bg-[var(--brand-wood-deep)]",
                          )}
                        >
                          {added ? "In enquiry" : "Add to enquiry"}
                        </button>

                        <a
                          href={itemWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ask about ${item.title} on WhatsApp`}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-3.5 py-2 text-xs font-medium text-[var(--brand-wood)] transition hover:border-[var(--brand-gold)] hover:bg-[var(--surface-faint)]"
                        >
                          <FaWhatsapp size={13} />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <QuickView product={quick} onClose={() => setQuick(null)} />

      <AnimatePresence>
        {showroomView && (
          <motion.div
            key={showroomView.id}
            className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close showroom view"
              onClick={() => setShowroomView(null)}
              className="absolute inset-0 bg-[var(--brand-wood-deep)]/70 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={showroomView.title}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-2xl bg-[var(--brand-ivory)] sm:rounded-2xl md:grid-cols-[1.2fr_0.8fr]"
            >
              <button
                type="button"
                onClick={() => setShowroomView(null)}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-toast)] text-[var(--brand-wood)] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
              >
                <X size={18} />
              </button>
              <div className="relative aspect-[4/5] bg-[var(--brand-cream)] md:aspect-auto md:min-h-[36rem]">
                {showroomView.type === "video" ? (
                  <video
                    src={showroomView.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={showroomView.image}
                    alt={showroomView.title}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-contain"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                  {categories.find((category) => category.slug === showroomView.category)?.label ?? showroomView.category}
                </p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-[var(--brand-wood)] sm:text-4xl">
                  {showroomView.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-[var(--text-muted)]">
                  {showroomView.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}