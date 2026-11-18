import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/server/auth";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Admin pages may block while navigating: each one checks the session and
 * reads live data at request time, so serving them instantly from a cache
 * isn't wanted. (Silences Next's dev-only "instant navigation" insight.)
 */
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

/**
 * Every admin page: checks the session, then shows the sidebar and the page.
 *
 * IMPORTANT: Next.js renders a layout and its page in parallel, so this check
 * does NOT protect page data. Every page and server action under app/admin
 * must call requireAdmin() itself before reading or changing anything.
 */
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Guarded>{children}</Guarded>
    </Suspense>
  );
}

async function Guarded({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--background)] lg:flex-row">
      <AdminNav username={session.username} />
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--text-muted)]">Loading the dashboard…</div>
  );
}
