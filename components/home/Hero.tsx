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
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { featuredVideos, heroBrand, heroSlides } from "../../lib/data";
import { generalWhatsappUrl } from "../../lib/whatsapp";
import { useEnquiry } from "../../context/EnquiryContext";

const SLIDE_MS = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = heroSlides.length;

// Brand block: plays once on page load, then stays put.
const brandGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Product line: changes with every slide.
const productLine: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { has, toggle } = useEnquiry();

  const slide = heroSlides[index];
  const added = has(slide.id);

  const go = (step: number) => setIndex((i) => (i + step + TOTAL) % TOTAL);

  // Re-armed on every slide change, so manual navigation restarts the timer.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % TOTAL),
      SLIDE_MS,
    );
    return () => clearTimeout(timer);
  }, [index, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden bg-[var(--brand-charcoal)]">
        <div aria-hidden="true" className="absolute inset-0">
          {reduceMotion ? (
            <Image
              src={heroSlides[0].image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40"
            />
          ) : (
            <video
              src={featuredVideos[3].src}
              poster={heroSlides[0].image}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover opacity-40"
            />
          )}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(16,15,12,0.78)_0%,rgba(16,15,12,0.56)_48%,rgba(16,15,12,0.38)_100%)]"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-20">
          {/* Copy */}
          <div>
            {/* Brand statement: static, always visible */}
            <motion.div
              variants={brandGroup}
              initial="hidden"
              animate="show"
            >
              <h1 className="font-display text-[clamp(2.4rem,5.6vw,4.6rem)] font-bold uppercase leading-[1.05] tracking-[0.03em] text-[var(--brand-ivory)]">
                {heroBrand.eyebrow.split(" ").map((w, i) => (
                  <span
                    key={`${w}-${i}`}
                    className="-mb-[0.12em] mr-[0.24em] inline-block overflow-hidden pb-[0.12em] align-bottom"
                  >
                    <motion.span variants={word} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                variants={rise}
                className="mt-2 font-display text-[1.5rem] italic text-[var(--brand-gold)] lg:text-2xl"
              >
                {heroBrand.headline}
              </motion.p>

              <motion.p
                variants={rise}
                className="mt-5 max-w-xl text-base leading-7 text-[rgba(247,241,230,0.88)] lg:text-lg lg:leading-8"
              >
                {heroBrand.sublines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </motion.p>
            </motion.div>

            {/* Rotating product line: what the carousel is showing right now */}
            <div className="mt-8 min-h-[7.5rem] max-w-md border-l border-[var(--brand-gold)] pl-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={slide.id}
                  variants={productLine}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <p className="text-sm font-medium text-[var(--brand-gold)]">
                    {slide.eyebrow}
                  </p>
                  <p className="mt-1.5 text-base leading-7 text-[rgba(247,241,230,0.84)] lg:text-lg lg:leading-8">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-ivory)] px-7 py-3.5 text-sm font-medium text-[var(--brand-wood-deep)] shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition hover:bg-[var(--brand-cream)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
              >
                See the collection
              </Link>
              <a
                href={generalWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-ivory)]"
              >
                <FaWhatsapp size={17} />
                <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                  Ask on WhatsApp
                </span>
              </a>
            </motion.div>

            {/* Slide controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex max-w-lg items-center gap-5"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous slide"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-[var(--brand-ivory)] transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next slide"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-[var(--brand-ivory)] transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Arch frame (unchanged) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mx-auto w-full max-w-md pb-10 lg:max-w-none lg:pl-10"
          >
            {/* Offset gold outline */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x: 20, y: -20 }}
              transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
              className="absolute bottom-10 left-0 right-0 top-0 rounded-t-[999px] rounded-b-[2rem] border border-[var(--brand-gold)] lg:left-10"
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
                      alt={s.name}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
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
                        Price on request
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <button
                    type="button"
                    aria-pressed={added}
                    onClick={() =>
                      toggle({
                        id: slide.id,
                        name: slide.name,
                        image: slide.image,
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
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}