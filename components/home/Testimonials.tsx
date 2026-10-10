"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../../lib/data";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  if (total === 0) return null;

  const t = testimonials[index];
  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="ribbon" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
          <WordReveal
            text="What customers say."
            className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-[var(--brand-wood)]"
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-14">
            <span
              aria-hidden
              className="hidden select-none font-display text-[9rem] leading-[0.7] text-[var(--brand-gold)] lg:block"
            >
              “
            </span>

            <div>
              <div className="min-h-[13rem] sm:min-h-[11rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={t.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <blockquote className="font-display text-[clamp(1.5rem,3vw,2.3rem)] font-medium leading-[1.25] text-[var(--brand-wood)]">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-4 text-base text-[var(--text-muted)]">
                      <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-[var(--brand-gold)]">
                        <Image
                          src={t.avatar ?? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"}
                          alt={t.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-[var(--brand-wood)]">
                          {t.name}
                        </span>
                        {t.detail ? <span className="block text-sm">{t.detail}</span> : null}
                      </div>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              {total > 1 && (
                <div className="mt-8 flex items-center gap-5 border-t border-[var(--border-subtle)] pt-6">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous testimonial"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(77,45,36,0.25)] text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next testimonial"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(77,45,36,0.25)] text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <p className="text-sm tabular-nums text-[var(--text-subtle)]">
                    <span className="text-[var(--brand-wood)]">
                      {pad(index + 1)}
                    </span>{" "}
                    / {pad(total)}
                  </p>
                </div>
              )}
            </div>
          </div>

         
        </div>
      </section>
    </MotionConfig>
  );
}