"use client";

import type { ComponentProps } from "react";
import { MotionConfig, motion } from "framer-motion";
import { SectionBackdrop } from "./SectionBackdrop";
import { WordReveal } from "./WordReveal";

type Variant = ComponentProps<typeof SectionBackdrop>["variant"];

export function PageHeader({
  title,
  intro,
  variant = "arch",
}: {
  title: string;
  intro: string;
  variant?: Variant;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant={variant} tone="light" className="opacity-90" />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8 lg:pb-14 lg:pt-20">
          <WordReveal
            as="h1"
            text={title}
            className="max-w-3xl font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-medium leading-[1.05] text-[var(--brand-wood)]"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8"
          >
            {intro}
          </motion.p>
        </div>
      </section>
    </MotionConfig>
  );
}