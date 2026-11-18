import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | TM Artisan",
  robots: { index: false },
};

/**
 * Last-resort 404. Public addresses get the full page in app/(site)/not-found.tsx;
 * this one stays light because Next.js includes it in every page it sends.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-gold)]">Error 404</p>
      <h1 className="mt-4 font-display text-5xl text-[var(--brand-wood)]">This page isn&apos;t here</h1>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--brand-wood)] px-7 py-3.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)]"
      >
        Go to the home page
      </Link>
    </main>
  );
}
