"use client";

import { MotionConfig, motion } from "framer-motion";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    title: "Choose",
    text: "Add pieces from the shop to your enquiry list, or describe what you want.",
  },
  {
    title: "Send",
    text: "Send the list to us on WhatsApp or by email. It is written out for you.",
  },
  {
    title: "Get a price",
    text: "We reply with a price for each piece and ask for measurements if we need them.",
  },
  {
    title: "Confirm",
    text: "Once you are happy with the price and the details, we start building.",
  },
];

export function HowItWorks() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="ribbon" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <WordReveal
            text="How an enquiry works."
            className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-[var(--brand-wood)]"
          />
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--text-muted)]">
            There is no cart and no checkout. You ask, we quote, and nothing is
            charged until you agree.
          </p>

          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                className="relative border-t border-[var(--border-subtle)] pt-6"
              >
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.1 }}
                  className="absolute -top-px left-0 h-px w-14 origin-left bg-[var(--brand-gold)]"
                />
                <span className="font-display text-5xl font-medium tabular-nums text-[var(--brand-gold-deep)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-2xl font-medium text-[var(--brand-wood)]">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[17rem] text-base leading-7 text-[var(--text-muted)]">
                  {s.text}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}