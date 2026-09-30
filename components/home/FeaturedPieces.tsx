"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "../../lib/data";
import { ProductCard } from "../shop/ProductCard";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FeaturedPieces() {
  const featured = products.filter((p) => p.featured);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="amber" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <WordReveal
                text="A few pieces to start with."
                className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-[var(--brand-wood)]"
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                className="mt-5 max-w-lg text-base leading-7 text-[var(--text-muted)]"
              >
                Add the ones you like to your enquiry list. We will send one
                price for the whole list.
              </motion.p>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-wood)]"
            >
              <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                See all {products.length} pieces
              </span>
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:[&>li:nth-child(3n+2)]:mt-12">
            {featured.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}