import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | TM Artisan",
  robots: { index: false },
};

const primary =
  "inline-flex items-center justify-center rounded-full bg-[var(--brand-wood)] px-7 py-3.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2";
const secondary =
  "inline-flex items-center justify-center rounded-full border border-[var(--brand-wood)]/30 px-7 py-3.5 text-sm font-medium text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]";

/** Public 404: shown inside the normal header and footer (app/(site)/layout.tsx). */
export default function SiteNotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-24 pt-36 text-center sm:pt-44">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-gold)]">Error 404</p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-[var(--brand-wood)] sm:text-6xl">
        This page isn&apos;t here
      </h1>
      <p className="mt-5 max-w-md text-base leading-7 text-[var(--text-muted)]">
        The link may be old or mistyped. Our furniture is still all here: browse the shop, see finished projects,
        or tell us what you&apos;d like made.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className={primary}>
          Browse the shop
        </Link>
        <Link href="/portfolio" className={secondary}>
          See our work
        </Link>
        <Link href="/" className={secondary}>
          Home page
        </Link>
      </div>
    </section>
  );
}
