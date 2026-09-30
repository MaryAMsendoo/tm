"use client";

import { MotionConfig, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "../../lib/data";
import { generalWhatsappUrl } from "../../lib/whatsapp";
import { SectionBackdrop } from "../ui/SectionBackdrop";
import { WordReveal } from "../ui/WordReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FinalCta() {
  const phone = siteConfig.phones[0];

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="sunset" tone="light" className="opacity-90" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="rounded-[2rem] bg-[var(--brand-wood-deep)] px-6 py-14 sm:px-12 lg:px-16 lg:py-20"
          >
            <WordReveal
              text="Tell us what you need and we will send a price."
              className="max-w-2xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.06] text-[var(--brand-ivory)]"
            />

            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--brand-ivory)]/75">
              A photo, a measurement or a rough idea is enough to start. We are
              in {siteConfig.address.split(",").slice(0, 2).join(",")}, and you
              can visit the workshop if you would like to see our work first.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href={generalWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-gold)] px-7 py-3.5 text-sm font-medium text-[var(--brand-wood-deep)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ivory)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-wood-deep)]"
              >
                <FaWhatsapp size={18} />
                Message us on WhatsApp
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="group text-sm font-medium text-[var(--brand-ivory)]"
              >
                <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-ivory)]">
                  Email us
                </span>
              </a>

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="group text-sm font-medium text-[var(--brand-ivory)]"
                >
                  <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-ivory)]">
                    Call {phone}
                  </span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}