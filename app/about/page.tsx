import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Reveal } from "../../components/ui/Reveal";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { mission, vision, values } from "../../lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "TM Artisan Enterprise is a furniture workshop in Gosa, Airport Road, Abuja.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="A furniture workshop in Gosa, Abuja."
        intro="TM Artisan Enterprise makes custom and ready-made furniture, and does the finishing work that goes around it."
        variant="tide"
      />

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="ribbon" tone="light" className="opacity-90" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-8 lg:py-20">
          <Reveal>
            {/* Placeholder image: replace with a photo of the workshop or the owner. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
              <Image
                src="/f6.png"
                alt="A fitted wardrobe with a built-in dressing table"
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-tight text-[var(--brand-wood)]">
              One workshop, made to order
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8">
              Every piece is built for a particular room, so we work from your
              measurements, finish and budget instead of a fixed catalogue.
            </p>
            <p className="mt-6 max-w-lg rounded-lg border border-dashed border-[var(--brand-gold)] px-4 py-3 text-sm leading-6 text-[var(--text-muted)]">
              Founder&apos;s story goes here: who started TM Artisan, how, and
              what they care about when they build. Ask the owner for a short
              paragraph in their own words, then replace this note.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="tide" tone="light" className="opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-20">
          {[
            { label: "Mission", text: mission },
            { label: "Vision", text: vision },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.1} className="border-t border-[var(--border-subtle)] pt-6">
              <p className="text-sm text-[var(--brand-gold-deep)]">{b.label}</p>
              <p className="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-medium leading-[1.25] text-[var(--brand-wood)]">
                {b.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8 lg:pb-28">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium text-[var(--brand-wood)]">
              What we hold to
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v}>
                <Reveal delay={(i % 4) * 0.06} className="border-t border-[var(--border-subtle)] py-5">
                  <span className="mr-3 text-sm tabular-nums text-[var(--brand-gold-deep)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-2xl text-[var(--brand-wood)]">{v}</span>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center text-sm font-medium text-[var(--brand-wood)]"
            >
              <span className="border-b border-[var(--brand-gold)] pb-0.5 transition group-hover:border-[var(--brand-wood)]">
                Get in touch
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}