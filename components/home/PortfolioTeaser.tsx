"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import type { PortfolioItem } from "../../lib/types";
import { imageUrl } from "../../lib/media";
import { useEnquiry } from "../../context/EnquiryContext";
import { useCategories } from "../../context/SiteContext";
import { PreviewVideo } from "../ui/PreviewVideo";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/** How many portfolio items the home page shows. */
const TEASER_COUNT = 16;

export function PortfolioTeaser({ items }: { items: PortfolioItem[] }) {
  const { has, toggle } = useEnquiry();
  const categories = useCategories();
  const label = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? "";
  const mediaItems = items.slice(0, TEASER_COUNT);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="mosaic" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <WordReveal
              text="Designs for your space."
              className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-[var(--brand-wood)]"
            />
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-wood)]"
            >
              <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                See the portfolio
              </span>
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {mediaItems.map((item, i) => {
              const categoryName = label(item.category);
              const added = has(item.id);

              return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                <figure className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--brand-cream)] shadow-[0_16px_38px_rgba(47,27,22,0.12)]">
                  {item.type === "video" ? (
                    <PreviewVideo
                      src={item.src}
                      poster={item.poster}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 32vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
                  {item.type === "video" && (
                    <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-4 sm:top-4">
                      Video walkthrough
                    </span>
                  )}
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                    <p className="text-xs text-white/75">
                      {categoryName}
                      {item.type === "image" && item.location ? `, ${item.location}` : ""}
                    </p>
                    <p className="mt-1 font-display text-lg leading-snug sm:text-xl lg:text-2xl">
                      {item.title}
                    </p>
                    <button
                      type="button"
                      aria-pressed={added}
                      onClick={() =>
                        toggle({
                          id: item.id,
                          name: item.title,
                          image: imageUrl(item.type === "video" ? (item.poster ?? "") : item.src, 800),
                          category: categoryName,
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
        </div>
      </section>
    </MotionConfig>
  );
}