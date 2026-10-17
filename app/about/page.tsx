import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Reveal } from "../../components/ui/Reveal";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import {
  ceoMessage,
  craftsmanship,
  mission,
  ourStory,
  portfolioProjects,
  values,
  vision,
} from "../../lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "TM Artisan Company Ltd makes bespoke furniture and interiors in Abuja. Built to Belong.",
};

const featuredWork = portfolioProjects.filter((p) =>
  ["p-kitchen-island", "p-bedroom-wardrobe", "p-tv-wall"].includes(p.id),
);

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
                src="/f6.png"
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

      {/* Meet our founder and CEO: picture + message, on a dark band so it reads as a personal letter */}
      <section className="relative isolate overflow-hidden bg-[var(--brand-charcoal)]">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-24">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-tight text-[var(--brand-ivory)]">
              {ceoMessage.title}
            </h2>
            {ceoMessage.photo ? (
              <div className="relative mt-8 aspect-[4/5] max-w-sm overflow-hidden rounded-2xl">
                <Image
                  src={ceoMessage.photo}
                  alt={`${ceoMessage.name}, ${ceoMessage.role}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 80vw"
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
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium text-[var(--brand-wood)]">
              Our values
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v}>
                <Reveal delay={(i % 4) * 0.06} className="border-t border-[var(--border-subtle)] py-5">
                  <span className="font-display text-2xl text-[var(--brand-wood)]">{v}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach to craftsmanship */}
      <section className="relative overflow-hidden">
        <SectionBackdrop variant="ribbon" tone="light" className="opacity-90" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium text-[var(--brand-wood)]">
              {craftsmanship.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)] lg:text-lg lg:leading-8">
              {craftsmanship.intro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2">
            {craftsmanship.points.map((pt, i) => (
              <Reveal
                key={pt.title}
                delay={(i % 2) * 0.08}
                className="border-t border-[var(--border-subtle)] py-6"
              >
                <h3 className="font-display text-2xl text-[var(--brand-wood)]">{pt.title}</h3>
                <p className="mt-2 max-w-md text-base leading-7 text-[var(--text-muted)]">
                  {pt.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio link */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8 lg:pb-28">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium text-[var(--brand-wood)]">
              See the work
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {featuredWork.map((w, i) => (
              <Reveal key={w.id} delay={i * 0.08}>
                <Link href="/portfolio" className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--brand-cream)]">
                    <Image
                      src={w.image}
                      alt={w.title}
                      fill
                      sizes="(min-width: 640px) 30vw, 92vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-muted)]">{w.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-wood)] px-7 py-3.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
            >
              View our portfolio
            </Link>
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