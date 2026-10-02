"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { categories, portfolioProjects } from "../../lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const RATIOS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

const chips = [
  { slug: null as string | null, label: "All" },
  ...categories
    .filter((c) => portfolioProjects.some((p) => p.category === c.slug))
    .map((c) => ({ slug: c.slug as string | null, label: c.label })),
];

export function PortfolioGallery() {
  const [category, setCategory] = useState<string | null>(null);

  const items = useMemo(
    () => portfolioProjects.filter((p) => !category || p.category === category),
    [category],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="group"
        aria-label="Filter by room"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            </button>
          );
        })}
      </div>

      <ul className="mt-10 columns-2 gap-4 lg:columns-3 lg:gap-6">
        {items.map((p, i) => (
          <motion.li
            key={`${category}-${p.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
            className="mb-4 break-inside-avoid lg:mb-6"
          >
            <figure className="group relative overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
              <div className={cn("relative w-full", RATIOS[i % RATIOS.length])}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 32vw, 46vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-3.5 text-[var(--brand-ivory)] lg:p-5">
                <p className="text-xs text-[var(--brand-ivory)]/80">
                  {categories.find((c) => c.slug === p.category)?.label}
                  {p.location ? `, ${p.location}` : ""}
                </p>
                <p className="mt-0.5 font-display text-base leading-snug sm:text-lg lg:text-xl">
                  {p.title}
                </p>
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </MotionConfig>
  );
}