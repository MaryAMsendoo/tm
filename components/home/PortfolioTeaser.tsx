"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { categories, portfolioProjects } from "../../lib/data";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const label = (slug: string) =>
  categories.find((c) => c.slug === slug)?.label ?? "";

export function PortfolioTeaser() {
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

          <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
            {portfolioProjects.slice(0, 4).map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
                className={cn(
                  i === 0 && "col-span-2 lg:col-span-1 lg:row-span-2",
                )}
              >
                <figure className="group relative h-full overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
                  <div
                    className={cn(
                      "relative w-full",
                      i === 0
                        ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[34rem]"
                        : "aspect-[3/4] lg:aspect-[4/3]",
                    )}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes={
                        i === 0
                          ? "(min-width: 1024px) 34vw, 92vw"
                          : "(min-width: 1024px) 32vw, 46vw"
                      }
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[var(--brand-ivory)] lg:p-5">
                    <p className="text-xs text-[var(--brand-ivory)]/80">
                      {label(p.category)}
                      {p.location ? `, ${p.location}` : ""}
                    </p>
                    <p className="mt-0.5 font-display text-lg leading-snug sm:text-xl lg:text-2xl">
                      {p.title}
                    </p>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}