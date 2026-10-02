"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { activeCategories, products } from "../../lib/data";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const tiles = activeCategories.map((c) => {
  const inCategory = products.filter((p) => p.category === c.slug);
  const cover = inCategory.find((p) => p.featured) ?? inCategory[0];
  return { ...c, count: inCategory.length, image: cover.images[0] };
});

export function ShopByRoom() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="mosaic" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12">
            <WordReveal
              text="Start with the room you are furnishing."
              className="max-w-xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-[var(--brand-wood)]"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              className="max-w-sm text-base leading-7 text-[var(--text-muted)] lg:justify-self-end"
            >
              Everything is made to order, to your size and finish. Pick a room
              to see what we have built.
            </motion.p>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 pb-10 md:grid-cols-4 md:gap-x-6">
            {tiles.map((t, i) => (
              <motion.li
                key={t.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.08 }}
                className={cn(i % 2 === 1 && "md:mt-12")}
              >
                <Link
                  href={`/shop?category=${t.slug}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
                    <Image
                      src={t.image}
                      alt={t.label}
                      fill
                      sizes="(min-width: 768px) 24vw, 46vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl font-medium leading-tight text-[var(--brand-wood)]">
                        {t.label}
                      </h3>
                     
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="mt-1.5 shrink-0 text-[var(--brand-gold-deep)] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}