/** Shared class names for the admin dashboard, built on the site's colour tokens. */

export const inputClass =
  "w-full rounded-xl border border-[rgba(77,45,36,0.25)] bg-[var(--surface-card)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40 disabled:opacity-60";

export const labelTextClass = "mb-1.5 block text-sm font-medium text-[var(--text-muted)]";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-wood)] px-5 py-2.5 text-sm font-medium text-[var(--brand-ivory)] transition hover:bg-[var(--brand-wood-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(77,45,36,0.25)] px-4 py-2 text-sm font-medium text-[var(--brand-wood)] transition hover:bg-[rgba(77,45,36,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] disabled:cursor-not-allowed disabled:opacity-60";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#a5432f]/40 px-4 py-2 text-sm font-medium text-[#a5432f] transition hover:bg-[#a5432f]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a5432f] disabled:cursor-not-allowed disabled:opacity-60";

export const cardClass = "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]";
