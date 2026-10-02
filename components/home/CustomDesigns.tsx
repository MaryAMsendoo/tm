"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "../../lib/data";
import { whatsappUrl } from "../../lib/whatsapp";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

// Placeholders: swap for real custom-job photos later.
const MAIN_IMAGE = "/f12.png";
const SECOND_IMAGE = "/f19.png";

export function CustomDesigns() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="tide" tone="light" className="opacity-90" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8 lg:py-24">
          {/* Images */}
          <div className="relative mx-auto w-full max-w-md pb-14 lg:max-w-none">
            <motion.div
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: EASE }}
              className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-2xl bg-[var(--brand-cream)]"
            >
              <Image
                src={MAIN_IMAGE}
                alt="A custom wall unit with floating shelves and a round mirror"
                fill
                sizes="(min-width: 1024px) 34vw, 70vw"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              className="absolute bottom-0 right-0 aspect-[3/4] w-[46%] overflow-hidden rounded-2xl border-4 border-[var(--brand-ivory)] bg-[var(--brand-cream)] shadow-[0_24px_60px_rgba(47,27,22,0.22)]"
            >
              <Image
                src={SECOND_IMAGE}
                alt="A shaped mirror with warm edge lighting"
                fill
                sizes="(min-width: 1024px) 16vw, 36vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Copy */}
          <div>
            <WordReveal
              text="Have a design in mind? We will build it."
              className="max-w-xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-[var(--brand-wood)]"
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            >
              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8">
                Bring a photo you saved, a sketch on paper, or only the
                measurements of the wall. We will work out the materials, the
                finish and the lighting with you, then send a price.
              </p>
              <p className="mt-4 max-w-lg text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8">
                Every piece in the shop can also be changed: a different size,
                colour or handle.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/custom-designs"
                  className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-wood)] px-7 py-3.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
                >
                  Custom designs
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href={whatsappUrl(
                    `Hello ${siteConfig.shortName}, I have a design in mind and I'd like to talk about it.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-wood)]"
                >
                  <FaWhatsapp size={17} />
                  <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                    Send your idea on WhatsApp
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}