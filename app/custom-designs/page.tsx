import type { Metadata } from "next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Reveal } from "../../components/ui/Reveal";
import { SectionBackdrop } from "../../components/ui/SectionBackdrop";
import { CustomRequestForm } from "../../components/custom/CustomRequestForm";
import { customOptions, otherServices } from "../../lib/data";

export const metadata: Metadata = {
  title: "Custom designs",
  description:
    "Furniture made to your size, colour and finish in Abuja. Send a photo, a sketch or your measurements.",
};

export default function CustomDesignsPage() {
  return (
    <>
      <PageHeader
        title="Bring the idea. We will build it."
        intro="A photo you saved, a sketch on paper, or only the measurements of the wall. Start with whatever you have."
        variant="canvas"
      />

      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-tight text-[var(--brand-wood)]">
              What you can change
            </h2>
          </Reveal>

          <ol className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {customOptions.map((o, i) => (
              <li key={o.title}>
                <Reveal delay={(i % 3) * 0.08} className="border-t border-[var(--border-subtle)] pt-5">
                  <span className="font-display text-3xl tabular-nums text-[var(--brand-gold-deep)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-medium text-[var(--brand-wood)]">
                    {o.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-base leading-7 text-[var(--text-muted)]">{o.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="amber" tone="light" className="opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-tight text-[var(--brand-wood)]">
              Tell us what you want
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[var(--text-muted)]">
              Fill this in and it opens as a message to us. We reply with a
              price, and ask for anything we still need.
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-[var(--text-muted)]">
              The form cannot attach files. Once the message opens in WhatsApp,
              add your photos, drawings or a picture of the wall there.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <CustomRequestForm />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="ribbon" tone="light" className="opacity-90" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8 lg:pb-28">
          <Reveal className="border-t border-[var(--border-subtle)] pt-10">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.3rem)] font-medium text-[var(--brand-wood)]">
              Other work we take on
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-base text-[var(--text-muted)]">
              {otherServices.map((s) => (
                <li key={s} className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-5 bg-[var(--brand-gold)]" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}