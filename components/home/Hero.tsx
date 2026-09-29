"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Check, Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { heroSlides } from "../../lib/data";
import { generalWhatsappUrl } from "../../lib/whatsapp";
import { useEnquiry } from "../../context/EnquiryContext";
import { SectionBackdrop } from "../ui/SectionBackdrop";

const SLIDE_MS = 5500;
const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE = ["Furniture for", "the way you", "live beautifully."];

const POINTS = [
  "Bespoke craftsmanship in Abuja",
  "Tailored to your space and finish",
  "Quotes sent after your enquiry",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { y: "108%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { has, toggle } = useEnquiry();

  const slide = heroSlides[index];
  const added = has(slide.id);

  // Re-armed on every slide change, so clicking a bar restarts the timer.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      SLIDE_MS,
    );
    return () => clearTimeout(timer);
  }, [index, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="amber" tone="light" className="opacity-90" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-20">
          {/* Copy */}
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.55)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" />
              Custom furniture studio
            </div>

            <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.8rem)] font-medium leading-[0.92] text-[var(--brand-wood)]">
              {HEADLINE.map((line) => (
                <span key={line} className="block overflow-hidden py-[0.04em]">
                  <motion.span variants={rise} className="block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
            >
              Thoughtful pieces for home and hospitality spaces, designed around
              how you live, gather, and unwind.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-wood)] px-7 py-3.5 text-sm font-medium text-[var(--brand-ivory)] shadow-[0_10px_25px_rgba(77,45,36,0.18)] transition hover:bg-[var(--brand-wood-deep)]"
              >
                View collection
              </Link>
              <a
                href={generalWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(77,45,36,0.22)] bg-white/35 px-7 py-3.5 text-sm font-medium text-[var(--brand-wood)] transition hover:border-[var(--brand-gold)] hover:bg-[rgba(77,45,36,0.03)]"
              >
                <FaWhatsapp size={18} />
                Ask for a quote
              </a>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="mt-10 flex flex-col gap-2.5 text-sm text-[var(--text-muted)] sm:flex-row sm:flex-wrap sm:gap-x-7"
            >
              {POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="shrink-0 text-[var(--brand-gold-deep)]"
                  />
                  {point}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Arch frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none lg:pl-10"
          >
            {/* Offset gold outline */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x: 20, y: -20 }}
              transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
              className="absolute inset-0 rounded-t-[999px] rounded-b-[2rem] border border-[var(--brand-gold)] lg:left-10"
            />

            <div className="relative aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2rem] shadow-[0_30px_80px_rgba(47,27,22,0.25)]">
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ delay: 0.15, duration: 1.1, ease: EASE }}
                className="absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-[var(--brand-cream)]"
              >
                {heroSlides.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{
                      opacity: i === index ? 1 : 0,
                      scale: i === index ? 1 : 1.08,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={s.image}
                      alt={s.name ?? "Furniture display"}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
                {/* Soft shade so the caption card always reads well */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
              </motion.div>

              {/* Caption card */}
              <div className="absolute -bottom-8 left-4 right-4 sm:-left-8 sm:right-auto sm:w-72">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-toast)] p-4 shadow-[0_18px_40px_rgba(47,27,22,0.18)] backdrop-blur-md">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="font-display text-2xl font-semibold leading-tight text-[var(--brand-wood)]">
                        {slide.name}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--text-subtle)]">
                        {slide.category ? `${slide.category}, ` : ""}price on
                        request
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <button
                    type="button"
                    aria-pressed={added}
                    onClick={() =>
                      toggle({
                        id: slide.id,
                        name: slide.name ?? "Untitled piece",
                        image: slide.image,
                        category: slide.category,
                      })
                    }
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2",
                      added
                        ? "bg-[var(--brand-gold)] text-[var(--brand-wood-deep)]"
                        : "bg-[var(--brand-wood)] text-[var(--brand-ivory)] hover:bg-[var(--brand-wood-deep)]",
                    )}
                  >
                    {added ? <Check size={16} /> : <Plus size={16} />}
                    {added ? "Added to enquiry" : "Add to enquiry"}
                  </button>
                </div>
              </div>
            </div>

            {/* Slide progress */}
            <div className="mt-16 flex justify-end gap-2 sm:mt-12">
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.name}`}
                  aria-current={i === index}
                  className="relative h-1.5 w-10 overflow-hidden rounded-full bg-[rgba(77,45,36,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                >
                  {i === index && (
                    <motion.span
                      key={index}
                      className="absolute inset-0 origin-left rounded-full bg-[var(--brand-gold-deep)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}