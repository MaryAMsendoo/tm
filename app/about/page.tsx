import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Reveal } from "../../components/ui/Reveal";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { ceoMessage, mission, ourStory, values, vision } from "../../lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "TM Artisan Company Ltd makes bespoke furniture and interiors in Abuja. Built to Belong.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="TM Artisan Company Ltd. Built to Belong."
        intro="Bespoke furniture and thoughtfully designed interiors, made in Abuja."
        variant="tide"
      />

      {/* Our story */}
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="ribbon" tone="light" className="opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            {/* Placeholder image: replace with a photo of the workshop or the founder. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
              <Image
                src="/ceo-tm.png"
                alt="A fitted wardrobe with a built-in dressing table"
                fill
                sizes="(min-width: 1024px) 34vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-tight text-[var(--brand-wood)]">
              Our story
            </h2>
            <p className="mt-5 max-w-2xl font-display text-xl leading-snug text-[var(--brand-wood)] lg:text-2xl">
              {ourStory.lede}
            </p>

            <div className="mt-8 max-w-2xl space-y-5">
              {ourStory.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Philosophy and motto */}
            <blockquote className="mt-10 max-w-2xl border-l-2 border-[var(--brand-gold)] pl-6">
              <p className="font-display text-[clamp(1.4rem,2.6vw,2rem)] italic leading-snug text-[var(--brand-wood)]">
                {ourStory.philosophy}
              </p>
            </blockquote>

            <p className="mt-10 max-w-2xl text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8">
              {ourStory.closing}
            </p>
            <p className="mt-3 font-display text-2xl font-bold uppercase tracking-[0.04em] text-[var(--brand-wood)] lg:text-3xl">
              {ourStory.motto}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission and vision */}
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

      {/* CEO message: set as a letter on a dark band so it reads differently from the story */}
      <section className="relative isolate overflow-hidden bg-[var(--brand-charcoal)]">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-tight text-[var(--brand-ivory)]">
              {ceoMessage.title}
            </h2>
            {ceoMessage.photo ? (
              <div className="relative mt-8 aspect-[4/5] max-w-xs overflow-hidden rounded-2xl">
                <Image
                  src={ceoMessage.photo}
                  alt={`${ceoMessage.name}, ${ceoMessage.role}`}
                  fill
                  sizes="(min-width: 1024px) 24vw, 70vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-2xl space-y-5">
              {ceoMessage.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-base leading-7 text-[rgba(247,241,230,0.86)] lg:text-lg lg:leading-8"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-10 max-w-2xl border-t border-[var(--brand-gold)]/60 pt-6">
              <p className="font-display text-2xl font-semibold text-[var(--brand-ivory)]">
                {ceoMessage.name}
              </p>
              <p className="mt-1 text-sm text-[rgba(247,241,230,0.72)]">
                {ceoMessage.role}
              </p>
              <p className="text-sm text-[rgba(247,241,230,0.72)]">
                {ceoMessage.company}
              </p>
              <p className="mt-5 font-display text-xl italic text-[var(--brand-gold)]">
                {ceoMessage.sign}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
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