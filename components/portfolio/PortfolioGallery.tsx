"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { categories, featuredVideos, portfolioProjects } from "../../lib/data";
import { useEnquiry } from "../../context/EnquiryContext";
import { PreviewVideo } from "../ui/PreviewVideo";

const EASE = [0.22, 1, 0.36, 1] as const;
const RATIOS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

const portfolioMedia = portfolioProjects.flatMap((project, index) => {
  const image = {
    id: project.id,
    title: project.title,
    category: project.category,
    location: project.location,
    src: project.image,
    type: "image" as const,
  };
  const video = featuredVideos[index];

  return video
    ? [
        image,
        {
          id: video.id,
          title: video.title,
          category: "sofas",
          src: video.src,
          type: "video" as const,
        },
      ]
    : [image];
});

const chips = [
  { slug: null as string | null, label: "All" },
  ...categories
    .filter((category) => portfolioMedia.some((item) => item.category === category.slug))
    .map((c) => ({ slug: c.slug as string | null, label: c.label })),
];

export function PortfolioGallery() {
  const [category, setCategory] = useState<string | null>(null);
  const { has, toggle } = useEnquiry();

  const items = useMemo(
    () => portfolioMedia.filter((item) => !category || item.category === category),
    [category],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="sticky top-16 z-40 -mx-5 border-y border-[var(--border-subtle)] bg-[var(--surface-header)] px-5 py-3 shadow-[0_8px_24px_rgba(47,27,22,0.08)] backdrop-blur-xl lg:-mx-8 lg:px-8">
        <label className="sr-only" htmlFor="portfolio-category-mobile">
          Filter by room
        </label>
        <select
          id="portfolio-category-mobile"
          value={category ?? ""}
          onChange={(event) => setCategory(event.target.value || null)}
          className="w-full appearance-none rounded-full border border-[var(--border-subtle)] bg-[var(--brand-ivory)] px-3.5 py-2.5 text-sm text-[var(--brand-wood)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40 lg:hidden"
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
      </div>

      <ul className="mt-10 columns-2 gap-4 lg:columns-3 lg:gap-6">
        {items.map((item, i) => {
          const categoryLabel = categories.find((c) => c.slug === item.category)?.label;
          const added = has(item.id);

          return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
            className="mb-4 break-inside-avoid lg:mb-6"
          >
            <figure className="group relative overflow-hidden rounded-2xl bg-[var(--brand-cream)] shadow-[0_16px_38px_rgba(47,27,22,0.1)]">
              <div className={cn("relative w-full", RATIOS[i % RATIOS.length])}>
                {item.type === "video" ? (
                  <PreviewVideo
                    src={item.src}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 32vw, 46vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
                {item.type === "video" && (
                  <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    Video walkthrough
                  </span>
                )}
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-3.5 text-white lg:p-5">
                <p className="text-xs text-white/75">
                  {categoryLabel}
                  {item.type === "image" && item.location ? `, ${item.location}` : ""}
                </p>
                <p className="mt-1 font-display text-base leading-snug sm:text-lg lg:text-xl">
                  {item.title}
                </p>
                <button
                  type="button"
                  aria-pressed={added}
                  onClick={() =>
                    toggle({
                      id: item.id,
                      name: item.title,
                      image: item.src,
                      category: categoryLabel,
                    })
                  }
                  className={cn(
                    "mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                    added
                      ? "bg-[var(--brand-gold)] text-[var(--brand-wood-deep)]"
                      : "bg-white/95 text-[var(--brand-wood-deep)] hover:bg-white",
                  )}
                >
                  {added ? <Check size={14} /> : <Plus size={14} />}
                  {added ? "Added" : "Add to enquiry"}
                </button>
              </figcaption>
            </figure>
          </motion.li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}